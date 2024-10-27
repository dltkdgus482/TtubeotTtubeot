package com.user.userttubeot.user.application;

import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
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

    /**
     * 회원 가입을 처리하는 메서드
     *
     * @param request 회원가입 요청 정보를 담은 DTO
     * @return 저장된 User 엔티티 객체
     */
    public User signup(UserSignupRequestDto request) {
        log.info("회원가입 요청이 들어왔습니다. 요청 사용자 이름: {}", request.getUserName());

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

    public boolean verifyUserCredentials(String userPhone, String password) {
        // 1. 전화번호로 사용자 조회
        User user = userRepository.findByUserPhone(userPhone)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 저장된 Salt와 암호화된 비밀번호 가져오기
        String salt = user.getUserPasswordSalt();  // 저장된 Salt 값
        String encryptedPassword = user.getUserPassword(); // 암호화된 비밀번호

        // 3. 입력된 비밀번호와 Salt를 결합하여 암호화
        String rawPassword = password + salt;
        boolean isPasswordMatch = passwordEncoder.matches(rawPassword, encryptedPassword);

        if (isPasswordMatch) {
            log.debug("비밀번호 일치. 로그인 성공.");
        } else {
            log.warn("비밀번호 불일치. 로그인 실패.");
        }

        return isPasswordMatch;
    }
}