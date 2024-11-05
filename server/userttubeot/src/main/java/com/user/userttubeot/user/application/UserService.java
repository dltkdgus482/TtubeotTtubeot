package com.user.userttubeot.user.application;

import com.user.userttubeot.ttubeot.application.service.TtubeotServiceImpl;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
import com.user.userttubeot.user.domain.dto.TokenDto;
import com.user.userttubeot.user.domain.dto.UserProfileDto;
import com.user.userttubeot.user.domain.dto.UserRankDto;
import com.user.userttubeot.user.domain.dto.UserResponseDto;
import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.dto.UserUpdateRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.exception.UserAlreadyExistsException;
import com.user.userttubeot.user.domain.exception.UserNotFoundException;
import com.user.userttubeot.user.domain.repository.UserRepository;
import com.user.userttubeot.user.global.util.NameValidator;
import com.user.userttubeot.user.infrastructure.security.JWTUtil;
import jakarta.transaction.Transactional;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsVerificationService smsVerificationService;
    private final JWTUtil jwtUtil;
    private final RedisService redisService;
    private final NameValidator nameValidator;
    private final TtubeotServiceImpl ttubeotService;
    private final UserTtubeotOwnershipRepository ownershipRepository;

    /**
     * 회원가입 요청 DTO를 User 엔티티로 변환
     *
     * @param dto               회원가입 요청 DTO
     * @param passwordSalt      비밀번호 암호화에 사용할 Salt 값
     * @param encryptedPassword 암호화된 비밀번호
     * @return 변환된 User 엔티티 객체
     */
    private static User fromDto(UserSignupRequestDto dto, String passwordSalt,
        String encryptedPassword) {
        return User.builder()
            .userName(dto.getUserName())
            .userPhone(dto.getUserPhone())
            .userPassword(encryptedPassword)
            .userPasswordSalt(passwordSalt)
            .userLocationAgreement(dto.getUserLocationAgreement() == 1)
            .userType((byte) dto.getUserType())
            .build();
    }

    /**
     * 리프레시 토큰을 기반으로 새로운 액세스 및 리프레시 토큰을 발급
     *
     * @param refreshToken 사용자로부터 받은 리프레시 토큰
     * @return 새로운 액세스 및 리프레시 토큰 DTO
     */
    public TokenDto reissueTokens(String refreshToken) {
        log.info("토큰 재발급 요청 - 리프레시 토큰: {}", refreshToken);

        String userPhone = jwtUtil.getUserPhone(refreshToken);
        Integer userId = jwtUtil.getUserId(refreshToken);
        String key = "refresh_" + userPhone;
        String storedToken = redisService.getValue(key);

        if (isInvalidRefreshToken(refreshToken, storedToken)) {
            log.warn("유효하지 않은 리프레시 토큰입니다: {}", refreshToken);
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        String newAccessToken = jwtUtil.createAccessToken(userId, userPhone);
        String newRefreshToken = jwtUtil.createRefreshToken(userId, userPhone);
        redisService.setValues(key, newRefreshToken, Duration.ofDays(1));

        log.info("토큰 재발급 성공 - userId: {}, userPhone: {}", userId, userPhone);
        return new TokenDto(newAccessToken, newRefreshToken);
    }

    /**
     * 회원가입 처리 메서드
     *
     * @param request 회원가입 요청 정보
     * @return 저장된 User 엔티티 객체
     */
    public User signup(UserSignupRequestDto request) {
        String userName = request.getUserName();
        String userPhone = request.getUserPhone();
        String userPassword = request.getUserPassword();

        log.info("회원가입 요청 - 사용자 이름: {}, 전화번호: {}", userName, userPhone);

        // 사용자 이름 유효성 검사
        nameValidator.validate(userName);

        // 비밀번호 유효성 검사
        validatePassword(userPassword);

        validateUserPhoneNotExists(userPhone);
        verifyPhone(userPhone);

        String passwordSalt = generateSalt();
        String encryptedPassword = passwordEncoder.encode(userPassword + passwordSalt);
        User user = fromDto(request, passwordSalt, encryptedPassword);
        User savedUser = userRepository.save(user);

        log.info("회원가입 성공 - userId: {}", savedUser.getUserId());
        return savedUser;
    }

    /**
     * 사용자를 ID로 조회
     *
     * @param userId 사용자 ID
     * @return 조회된 User 엔티티
     */
    public User findUserById(Integer userId) {
        log.info("사용자 조회 요청 - 사용자 ID: {}", userId);
        return userRepository.findById(userId)
            .orElseThrow(
                () -> new UserNotFoundException("ID: " + userId + "에 해당하는 사용자를 찾을 수 없습니다."));
    }

    /**
     * 사용자 정보 업데이트 (부분 업데이트)
     *
     * @param userId    사용자 ID
     * @param updateDto 업데이트 요청 정보
     */
    public void partiallyUpdateUser(Integer userId, UserUpdateRequestDto updateDto) {
        log.info("사용자 정보 부분 업데이트 요청 - 사용자 ID: {}", userId);

        User user = findUserById(userId);

        User updatedUser = user.toBuilder()
            .userLocationAgreement(updateDto.getUserLocationAgreement() != null
                ? updateDto.getUserLocationAgreement() == 1
                : user.getUserLocationAgreement())
            .userParent(updateDto.getUserParent() != null
                ? updateDto.getUserParent()
                : user.getUserParent())
            .build();

        userRepository.save(updatedUser);
        log.info("사용자 정보 업데이트 성공 - 사용자 ID: {}", userId);
    }

    /**
     * 사용자 이름 중복 여부 확인
     *
     * @param username 확인할 사용자 이름
     * @return 중복 여부
     */
    public boolean isUsernameAvailable(String username) {
        log.debug("사용자 이름 중복 확인 - 사용자 이름: {}", username);
        return !userRepository.existsByUserName(username);
    }

    /**
     * 사용자 프로필 조회
     *
     * @param userId 사용자 ID
     * @return 조회된 UserResponseDto 객체
     */
    public UserResponseDto getUserProfile(Integer userId) {
        log.info("사용자 프로필 조회 - 사용자 ID: {}", userId);
        return UserResponseDto.fromEntity(findUserById(userId));
    }

    /**
     * 사용자 삭제
     *
     * @param userId 삭제할 사용자 ID
     */
    public void deleteUserById(Integer userId) {
        log.info("사용자 삭제 요청 - 사용자 ID: {}", userId);

        User user = findUserById(userId);

        if (user.getUserStatus() == -1) {
            log.warn("이미 삭제된 사용자 - 사용자 ID: {}", userId);
            throw new IllegalStateException("이미 삭제된 사용자입니다.");
        }

        userRepository.delete(user);
        log.info("사용자 완전 삭제 완료 - 사용자 ID: {}", userId);
    }

    // Private helper methods

    /**
     * 비밀번호 변경 처리
     *
     * @param userId      사용자 ID
     * @param userPhone   사용자 전화번호
     * @param newPassword 새 비밀번호
     */
    public void changePassword(Integer userId, String userPhone, String newPassword) {
        log.info("비밀번호 변경 요청 - 사용자 ID: {}, 전화번호: {}", userId, userPhone);

        validatePassword(newPassword);

        if (!smsVerificationService.isPhoneVerified(userPhone)) {
            log.warn("비밀번호 변경 실패 - 인증 코드가 일치하지 않음: 전화번호: {}", userPhone);
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        smsVerificationService.deleteVerificationCode(userPhone);

        User user = userRepository.findById(userId)
            .filter(u -> u.getUserPhone().equals(userPhone))
            .orElseThrow(() -> new IllegalArgumentException("전화번호가 일치하지 않습니다."));

        String salt = user.getUserPasswordSalt();
        String encryptedPassword = passwordEncoder.encode(newPassword + salt);

        userRepository.save(user.toBuilder().userPassword(encryptedPassword).build());
        log.info("비밀번호 변경 성공 - 사용자 ID: {}", user.getUserId());
    }

    private void validateUserPhoneNotExists(String userPhone) {
        if (userRepository.existsByUserPhone(userPhone)) {
            log.warn("이미 존재하는 사용자 - 전화번호: {}", userPhone);
            throw new UserAlreadyExistsException("이미 존재하는 사용자입니다.");
        }
    }

    private void verifyPhone(String userPhone) {
        if (!smsVerificationService.isPhoneVerified(userPhone)) {
            log.warn("전화번호 인증 실패 - 전화번호: {}", userPhone);
            throw new IllegalArgumentException("전화번호 인증이 필요합니다.");
        }
        smsVerificationService.deleteVerificationCode(userPhone);
        log.info("전화번호 인증 후 Redis 데이터 삭제 - 전화번호: {}", userPhone);
    }

    /**
     * 랜덤한 Salt 값을 생성
     *
     * @return 10자리의 Salt 값
     */
    private String generateSalt() {
        String salt = UUID.randomUUID().toString().substring(0, 10);
        log.debug("생성된 비밀번호 Salt: {}", salt);
        return salt;
    }

    /**
     * 비밀번호 유효성 검사
     *
     * @param password 검사할 비밀번호
     */
    private void validatePassword(String password) {
        // 비밀번호가 6~15자의 영문과 숫자 조합인지 확인하는 정규식
        String passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,15}$";

        if (!password.matches(passwordPattern)) {
            log.warn("비밀번호 유효성 검사 실패 - 비밀번호가 조건에 맞지 않습니다: {}", password);
            throw new IllegalArgumentException("비밀번호는 영문과 숫자를 포함한 6~15자 조합이어야 합니다.");
        }
    }

    private boolean isInvalidRefreshToken(String refreshToken, String storedToken) {
        return storedToken == null || !storedToken.equals(refreshToken) || jwtUtil.isExpired(
            refreshToken);
    }

    public List<UserRankDto> getAllUserRanks() {
        return userRepository.findAll().stream()
            .map(user -> {
                Integer userId = user.getUserId();
                int score = ownershipRepository.findByUser_UserId(userId).stream()
                    .mapToInt(UserTtuBeotOwnership::getTtubeotScore)
                    .sum();

                return new UserRankDto(
                    userId,
                    user.getUserName(),
                    score,
                    ttubeotService.getTtubeotOwnershipId(userId)
                );
            })
            .sorted(Comparator.comparingInt(UserRankDto::getScore).reversed())
            .collect(Collectors.toList());
    }

    /**
     * 특정 사용자에 대한 상세 정보를 조회하는 메서드.
     */
    public UserProfileDto getUserDetail(Integer userId) {
        // 사용자 정보 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 사용자 이름과 Ttubeot ID 반환
        UserProfileDto userProfile = new UserProfileDto();
        userProfile.setUsername(user.getUserName());
        userProfile.setTtubeotId(ttubeotService.getTtubeotOwnershipId(userId));

        return userProfile;
    }
}
