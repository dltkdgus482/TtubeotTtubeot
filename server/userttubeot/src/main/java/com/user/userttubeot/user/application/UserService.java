package com.user.userttubeot.user.application;

import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.exception.UserAlreadyExistsException;
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
     * UserSignupRequestDto를 User 엔티티로 변환하는 메서드
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

    public String reissueTokens(String refreshToken) {
        // 1. 리프레시 토큰 유효성 확인
        String userPhone = jwtUtil.getUserPhone(refreshToken);
        Integer userId = jwtUtil.getUserId(refreshToken);
        String storedToken = redisService.getValue("refresh_" + userPhone);

        if (storedToken == null || !storedToken.equals(refreshToken) || jwtUtil.isExpired(
            refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 2. 새 액세스 및 리프레시 토큰 발급
        String newAccessToken = jwtUtil.createAccessToken(userId, userPhone);
        String newRefreshToken = jwtUtil.createRefreshToken(userId, userPhone);

        // 3. Redis에 새로운 리프레시 토큰 저장 (기존 토큰을 대체)
        redisService.setValues("refresh_" + userPhone, newRefreshToken, Duration.ofDays(1));

        return newAccessToken; // 필요 시 새 리프레시 토큰도 반환
    }

    /**
     * 회원 가입을 처리하는 메서드
     *
     * @param request 회원가입 요청 정보를 담은 DTO
     * @return 저장된 User 엔티티 객체
     */
    public User signup(UserSignupRequestDto request) {
        log.info("회원가입 요청이 들어왔습니다. 요청 사용자 이름: {}", request.getUserName());

        // 중복 회원 예외
        if (userRepository.existsByUserPhone(request.getUserPhone())) {
            throw new UserAlreadyExistsException("이미 존재하는 사용자입니다.");
        }

        // 전화번호 인증 여부 확인
        if (!smsVerificationService.isPhoneVerified(request.getUserPhone())) {
            log.warn("회원가입 실패 - 전화번호 인증이 되지 않았습니다. 전화번호: {}", request.getUserPhone());
            throw new IllegalArgumentException("전화번호 인증이 필요합니다.");
        }

        // 전화번호 인증 정보 삭제
        smsVerificationService.deleteVerificationCode(request.getUserPhone());
        log.info("전화번호 인증 후 Redis 데이터 삭제 완료. 전화번호: {}", request.getUserPhone());

        // 비밀번호 암호화 및 Salt 생성
        String passwordSalt = generateSalt();
        log.debug("생성된 비밀번호 Salt: {}", passwordSalt);
        String encryptedPassword = passwordEncoder.encode(request.getUserPassword() + passwordSalt);
        log.debug("암호화된 비밀번호 생성 완료");

        // User 엔티티 생성 및 저장
        User user = fromDto(request, passwordSalt, encryptedPassword);
        User savedUser = userRepository.save(user);
        log.info("회원가입 성공. 사용자 ID: {}", savedUser.getUserId());

        return savedUser;
    }

    /**
     * 랜덤한 Salt 값을 생성하는 메서드
     *
     * @return 랜덤하게 생성된 10자리의 Salt 값
     */
    private String generateSalt() {
        return UUID.randomUUID().toString().substring(0, 10);
    }

}