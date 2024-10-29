package com.user.userttubeot.user.application;

import com.user.userttubeot.user.domain.dto.TokenDto;
import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.dto.UserUpdateRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.exception.UserAlreadyExistsException;
import com.user.userttubeot.user.domain.exception.UserNotFoundException;
import com.user.userttubeot.user.domain.repository.UserRepository;
import com.user.userttubeot.user.infrastructure.security.JWTUtil;
import jakarta.transaction.Transactional;
import java.time.Duration;
import java.util.UUID;
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

    private boolean isInvalidRefreshToken(String refreshToken, String storedToken) {
        return storedToken == null || !storedToken.equals(refreshToken) || jwtUtil.isExpired(
            refreshToken);
    }

    /**
     * 회원가입 처리 메서드
     *
     * @param request 회원가입 요청 정보
     * @return 저장된 User 엔티티 객체
     */
    public User signup(UserSignupRequestDto request) {
        log.info("회원가입 요청 - 사용자 이름: {}, 전화번호: {}", request.getUserName(), request.getUserPhone());

        validateUserPhoneNotExists(request.getUserPhone());
        verifyPhone(request.getUserPhone());

        String passwordSalt = generateSalt();
        String encryptedPassword = passwordEncoder.encode(request.getUserPassword() + passwordSalt);
        User user = fromDto(request, passwordSalt, encryptedPassword);
        User savedUser = userRepository.save(user);

        log.info("회원가입 성공 - userId: {}", savedUser.getUserId());
        return savedUser;
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

    public User findUserById(Integer userId) {
        return userRepository.findById(userId)
            .orElseThrow(
                () -> new UserNotFoundException("ID: " + userId + "에 해당하는 사용자를 찾을 수 없습니다."));
    }


    public void partiallyUpdateUser(Integer userId, UserUpdateRequestDto updateDto) {
        User user = findUserById(userId);

        User updatedUser = user.toBuilder()
            .userLocationAgreement(updateDto.getUserLocationAgreement() != null
                ? updateDto.getUserLocationAgreement() == 1
                : user.getUserLocationAgreement())
            .userParent(updateDto.getUserParent() != null
                ? updateDto.getUserParent()
                : user.getUserParent())
            .build();

        // 수정된 사용자 정보를 저장
        userRepository.save(updatedUser);
    }

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUserName(username);
    }
}
