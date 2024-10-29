package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.UserService;
import com.user.userttubeot.user.domain.dto.CustomUserDetails;
import com.user.userttubeot.user.domain.dto.TokenDto;
import com.user.userttubeot.user.domain.dto.UserResponseDto;
import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.dto.UserUpdateRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.exception.ResponseMessage;
import com.user.userttubeot.user.domain.exception.UserNotFoundException;
import com.user.userttubeot.user.infrastructure.security.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final CookieUtil cookieUtil;

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

    @PostMapping("/reissue")
    public ResponseEntity<?> reissueToken(HttpServletRequest request,
        HttpServletResponse response) {
        try {
            log.info("토큰 재발급 요청이 들어왔습니다.");

            String refreshToken = cookieUtil.extractRefreshToken(request);

            // 액세스 및 리프레시 토큰을 포함한 Dto 반환
            TokenDto tokens = userService.reissueTokens(refreshToken);
            log.info("토큰 재발급 성공.");

            response.setHeader("Authorization", "Bearer " + tokens.getAccessToken());
            response.addCookie(cookieUtil.createCookie("refresh", tokens.getRefreshToken()));

            return ResponseEntity.ok("토큰 재발급 성공");

        } catch (IllegalArgumentException e) {
            log.error("토큰 재발급 실패 - 잘못된 리프레시 토큰: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("토큰 재발급 실패: 유효하지 않은 리프레시 토큰입니다.");
        } catch (Exception e) {
            log.error("토큰 재발급 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("토큰 재발급 실패: 서버 오류가 발생했습니다.");
        }
    }

    @PatchMapping("/me")
    public ResponseEntity<?> partiallyUpdateUserInfo(@RequestBody UserUpdateRequestDto updateDto,
        @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Integer userId = userDetails.getUserId();
            userService.partiallyUpdateUser(userId, updateDto);
            return ResponseEntity.ok(new ResponseMessage("사용자 정보가 수정되었습니다."));
        } catch (IllegalArgumentException e) {
            // 잘못된 요청에 대해 400 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseMessage("잘못된 요청 방식입니다."));
        } catch (AuthenticationException e) {
            // 인증 실패에 대해 401 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ResponseMessage("사용자 검증에 실패했습니다."));
        } catch (Exception e) {
            // 기타 예외는 500 에러로 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류가 발생했습니다."));
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam("username") String username) {
        boolean isAvailable = userService.isUsernameAvailable(username);
        String message = isAvailable ? "사용 가능한 사용자 이름입니다." : "이미 사용 중인 사용자 이름입니다.";
        return ResponseEntity.ok(new ResponseMessage(message));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(
        @AuthenticationPrincipal CustomUserDetails userDetails) {
        Integer userId = userDetails.getUserId();
        log.info("사용자 프로필 조회 요청 - 사용자 ID: {}", userId);

        try {
            UserResponseDto profile = userService.getUserProfile(userId);
            log.info("사용자 프로필 조회 성공 - 사용자 ID: {}", userId);
            return ResponseEntity.ok(profile);
        } catch (UserNotFoundException e) {
            log.warn("사용자 프로필 조회 실패 - 사용자 ID: {}: {}", userId, e.getMessage());
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        } catch (Exception e) {
            log.error("사용자 프로필 조회 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(500).body("서버 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Integer userId = userDetails.getUserId();
        log.info("사용자 삭제 요청 - 사용자 ID: {}", userId);

        try {
            // 사용자 삭제 처리
            userService.deleteUserById(userId);
            log.info("사용자 삭제 성공 - 사용자 ID: {}", userId);
            return ResponseEntity.ok(new ResponseMessage("사용자가 성공적으로 삭제되었습니다."));
        } catch (UserNotFoundException e) {
            log.warn("사용자 삭제 실패 - 사용자 ID: {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseMessage("사용자를 찾을 수 없습니다."));
        } catch (Exception e) {
            log.error("사용자 삭제 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류가 발생했습니다."));
        }
    }


}