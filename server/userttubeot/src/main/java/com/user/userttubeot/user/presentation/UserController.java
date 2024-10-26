package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.SmsVerificationService;
import com.user.userttubeot.user.application.UserService;
import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final SmsVerificationService smsVerificationService;  // SmsVerificationService 주입

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequestDto request) {
        try {
            log.info("회원가입 요청이 들어왔습니다. 요청 사용자 이름: {}", request.getUserName());

            // 전화번호 인증 여부 확인
            boolean isPhoneVerified = smsVerificationService.isPhoneVerified(
                request.getUserPhone());
            if (!isPhoneVerified) {
                log.warn("회원가입 실패 - 전화번호 인증이 되지 않았습니다. 전화번호: {}", request.getUserPhone());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("전화번호 인증이 필요합니다.");
            }
            // 레디스에서 인증 관련 정보 삭제
            if (smsVerificationService.deleteVerificationCode(request.getUserPhone())) {
                log.info("전화번호 인증 후 Redis 데이터 삭제 완료. 전화번호: {}", request.getUserPhone());
            }

            // UserService를 호출하여 회원가입 처리
            User newUser = userService.signup(request);
            log.info("회원가입 성공. 사용자 ID: {}", newUser.getUserId());

            return ResponseEntity.ok(newUser);

        } catch (IllegalArgumentException e) {
            log.error("회원가입 실패 - 잘못된 요청 데이터: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입 실패: 잘못된 요청 데이터입니다.");

        } catch (Exception e) {
            log.error("회원가입 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("회원가입 실패: 서버 오류가 발생했습니다.");
        }
    }
}
