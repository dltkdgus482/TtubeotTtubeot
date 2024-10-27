package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.AuthService;
import com.user.userttubeot.user.application.UserService;
import com.user.userttubeot.user.domain.dto.UserLoginRequestDto;
import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.MethodNotAllowedException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequestDto request) {
        try {
            log.info("회원가입 요청이 들어왔습니다. 요청 사용자 이름: {}", request.getUserName());

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequestDto requestDto,
        HttpServletResponse response) {
        try {
            // 로그인 서비스 호출
            authService.login(requestDto.getUserPhone(), requestDto.getUserPassword(), response);

            // 정상 처리 200 응답
            return ResponseEntity.ok("Login successful");

        } catch (IllegalArgumentException e) {
            log.error("로그인 실패 - 잘못된 사용자 정보: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 잘못된 사용자 정보입니다.");

        } catch (UnsupportedOperationException e) {
            log.error("로그인 실패 - 이미 삭제된 계정: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 이미 삭제된 계정입니다.");

        } catch (MethodNotAllowedException e) {
            log.error("잘못된 API 메서드 요청: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body("잘못된 API Method 요청입니다.");

        } catch (Exception e) {
            log.error("로그인 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("로그인 실패: 잘못된 요청 방식입니다.");
        }
    }
}