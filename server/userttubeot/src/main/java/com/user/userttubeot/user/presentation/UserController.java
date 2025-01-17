package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.UserService;
import com.user.userttubeot.user.domain.dto.CustomUserDetails;
import com.user.userttubeot.user.domain.dto.TokenDto;
import com.user.userttubeot.user.domain.dto.UserChangePasswordRequestDto;
import com.user.userttubeot.user.domain.dto.UserProfileDto;
import com.user.userttubeot.user.domain.dto.UserRankDto;
import com.user.userttubeot.user.domain.dto.UserResponseDto;
import com.user.userttubeot.user.domain.dto.UserRewardResqDto;
import com.user.userttubeot.user.domain.dto.UserSignupRequestDto;
import com.user.userttubeot.user.domain.dto.UserUpdateRequestDto;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.exception.ResponseMessage;
import com.user.userttubeot.user.domain.exception.UserNotFoundException;
import com.user.userttubeot.user.infrastructure.security.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final CookieUtil cookieUtil;
    @Value("${secret.key}")
    private String secretHeader;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid UserSignupRequestDto request) {
        try {
            log.info("회원가입 요청이 들어왔습니다. 요청 사용자 이름: {}", request.getUserName());

            User newUser = userService.signup(request);
            log.info("회원가입 성공. 사용자 ID: {}", newUser.getUserId());

            return ResponseEntity.ok(new ResponseMessage("회원가입 성공"));

        } catch (IllegalArgumentException e) {
            log.error("회원가입 실패 - 잘못된 요청 데이터: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseMessage("회원가입 실패: " + e.getMessage()));
        } catch (Exception e) {
            log.error("회원가입 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("회원가입 실패: 서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissueToken(HttpServletRequest request,
        HttpServletResponse response) {
        try {
            log.info("토큰 재발급 요청이 들어왔습니다.");

            String refreshToken = cookieUtil.extractRefreshToken(request);

            TokenDto tokens = userService.reissueTokens(refreshToken);
            log.info("토큰 재발급 성공.");

            response.setHeader("Authorization", "Bearer " + tokens.getAccessToken());
            response.addCookie(cookieUtil.createCookie("refresh", tokens.getRefreshToken()));

            return ResponseEntity.ok(new ResponseMessage("토큰 재발급 성공"));

        } catch (IllegalArgumentException e) {
            log.error("토큰 재발급 실패 - 잘못된 리프레시 토큰: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ResponseMessage("토큰 재발급 실패: 유효하지 않은 리프레시 토큰입니다."));
        } catch (Exception e) {
            log.error("토큰 재발급 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("토큰 재발급 실패: 서버 오류가 발생했습니다."));
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseMessage("잘못된 요청 방식입니다."));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ResponseMessage("사용자 검증에 실패했습니다."));
        } catch (Exception e) {
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
            return ResponseEntity.status(404).body(new ResponseMessage("사용자를 찾을 수 없습니다."));
        } catch (Exception e) {
            log.error("사용자 프로필 조회 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ResponseMessage("서버 오류가 발생했습니다."));
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Integer userId = userDetails.getUserId();
        log.info("사용자 삭제 요청 - 사용자 ID: {}", userId);

        try {
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

    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(
        @RequestBody @Valid UserChangePasswordRequestDto dto) {

        String userPhone = dto.getPhone();
        String newPassword = dto.getPassword();

        log.info("비밀번호 변경 요청 - 사용자 전화번호: {}", userPhone);
        try {
            userService.changePassword(userPhone, newPassword);
            log.info("비밀번호 변경 성공 - 사용자 전화번호: {}", userPhone);
            return ResponseEntity.ok(new ResponseMessage("비밀번호가 성공적으로 변경되었습니다."));
        } catch (UserNotFoundException e) {
            log.warn("비밀번호 변경 실패 - 사용자 없음: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseMessage("사용자를 찾을 수 없습니다."));
        } catch (IllegalArgumentException e) {
            log.warn("비밀번호 변경 실패 - 인증 정보 없음: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseMessage("인증 정보가 존재하지 않습니다."));
        } catch (Exception e) {
            log.error("비밀번호 변경 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류가 발생했습니다."));
        }
    }

    @GetMapping("/ranking")
    public ResponseEntity<?> getAllUserRanks() {
        log.info("전체 사용자 순위 조회 요청");
        try {
            List<UserRankDto> ranks = userService.getAllUserRanks();
            log.info("전체 사용자 순위 조회 성공 - 순위 개수: {}", ranks.size());
            return ResponseEntity.ok(ranks);
        } catch (Exception e) {
            log.error("전체 사용자 순위 조회 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류가 발생했습니다."));
        }
    }

    @GetMapping("/other-profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable("userId") Integer userId) {
        log.info("사용자 정보 조회 요청 - 사용자 ID: {}", userId);
        try {
            UserProfileDto userProfile = userService.getUserDetail(userId);
            log.info("사용자 정보 조회 성공 - 사용자 ID: {}, 사용자 이름: {}", userId, userProfile.getUsername());
            return ResponseEntity.ok(userProfile);
        } catch (IllegalArgumentException e) {
            log.warn("사용자 정보 조회 실패 - 사용자 ID: {}, 에러: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseMessage("사용자를 찾을 수 없습니다."));
        } catch (Exception e) {
            log.error("사용자 정보 조회 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/user/adventure-coin")
    public ResponseEntity<?> adventureCoin(
        @RequestHeader("Secret-Key") String secretKey,
        @RequestBody UserRewardResqDto dto
    ) {
        return processCoinRequest("모험 코인 요청", secretKey, dto);
    }

    @PostMapping("/user/find-treasure")
    public ResponseEntity<?> findTreasure(
        @RequestHeader("Secret-Key") String secretKey,
        @RequestBody UserRewardResqDto dto
    ) {
        return processCoinRequest("보물 획득 요청", secretKey, dto);
    }

    private ResponseEntity<?> processCoinRequest(
        String logPrefix,
        String secretKey,
        UserRewardResqDto dto
    ) {
        try {
            // 요청 로그
            log.info("{}: userId={}, coin={}", logPrefix, dto.getUserId(), dto.getCoin());

            // Secret-Key 검증
            if (!secretHeader.equals(secretKey)) {
                log.warn("{} - 잘못된 Secret-Key가 제공되었습니다: {}", logPrefix, secretKey);
                return ResponseEntity.status(403).body("잘못된 Secret-Key입니다.");
            }

            // 비즈니스 로직 수행
            Integer userId = dto.getUserId();
            Integer coin = dto.getCoin();
            userService.addCoins(userId, coin);

            // 성공 로그
            log.info("{} - 성공적으로 코인 추가: userId={}, 추가된 코인={}", logPrefix, userId, coin);
            return ResponseEntity.ok("코인이 성공적으로 추가되었습니다.");
        } catch (IllegalArgumentException e) {
            // 입력 데이터 유효성 오류
            log.error("{} - 입력 데이터 오류: {}", logPrefix, e.getMessage());
            return ResponseEntity.badRequest().body("잘못된 입력 데이터입니다.");
        } catch (Exception e) {
            // 예기치 못한 에러
            log.error("{} - 예기치 못한 오류 발생", logPrefix, e);
            return ResponseEntity.status(500).body("서버 내부 오류가 발생했습니다.");
        }
    }
}
