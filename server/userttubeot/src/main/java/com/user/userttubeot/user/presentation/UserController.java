package com.user.userttubeot.user.presentation;

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

    private final UserService userService;  // UserService 의존성 주입

    /**
     * 회원가입 요청을 처리하는 메서드
     *
     * @param request 회원가입 요청 정보를 담은 DTO
     * @return 생성된 User 객체와 HTTP 상태 코드를 포함한 ResponseEntity
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequestDto request) {
        try {
            log.info("회원가입 요청이 들어왔습니다. 요청 사용자 이름: {}", request.getUserName());

            // UserService를 호출하여 회원가입 처리
            User newUser = userService.signup(request);
            log.info("회원가입 성공. 사용자 ID: {}", newUser.getUserId());

            // 성공 응답 반환
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
