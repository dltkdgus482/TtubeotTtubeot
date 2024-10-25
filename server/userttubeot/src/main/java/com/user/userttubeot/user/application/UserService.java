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

    private final UserRepository userRepository;   // 사용자 저장소
    private final PasswordEncoder passwordEncoder; // 비밀번호 암호화 인코더

    /**
     * 회원 가입을 처리하는 메서드
     *
     * @param request 회원가입 요청 정보를 담은 DTO
     * @return 저장된 User 엔티티 객체
     */
    public User signup(UserSignupRequestDto request) {
        log.info("회원가입 요청이 들어왔습니다. 요청 사용자 이름: {}", request.getUserName());

        // 비밀번호 암호화 및 Salt 생성
        String passwordSalt = generateSalt();
        log.debug("생성된 비밀번호 Salt: {}", passwordSalt);
        String encryptedPassword = passwordEncoder.encode(request.getUserPassword() + passwordSalt);
        log.debug("암호화된 비밀번호 생성 완료");

        // User 엔티티 생성
        User user = fromDto(request, passwordSalt, encryptedPassword);
        log.info("User 엔티티 생성 완료. 사용자 이름: {}", user.getUserName());

        // 데이터베이스에 저장
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
     * UserSignupRequestDto를 User 엔티티로 변환하는 정적 메서드.
     *
     * @param dto               회원가입 요청 DTO
     * @param passwordSalt      비밀번호 암호화에 사용할 Salt 값
     * @param encryptedPassword 암호화된 비밀번호
     * @return 변환된 User 엔티티 객체
     */
    private static User fromDto(UserSignupRequestDto dto, String passwordSalt,
        String encryptedPassword) {
        log.debug("User 엔티티로 변환 시작");

        // User 엔티티 빌드
        User user = User.builder()
            .userName(dto.getUserName())
            .userPhone(dto.getUserPhone())
            .userPassword(encryptedPassword)
            .userPasswordSalt(passwordSalt)
            .userLocationAgreement(dto.getUserLocationAgreement() == 1)
            .userType((byte) dto.getUserType())
            .build();

        log.debug("User 엔티티 변환 완료");
        return user;
    }
}
