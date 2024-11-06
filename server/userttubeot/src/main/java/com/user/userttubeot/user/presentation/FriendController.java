package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.FriendService;
import com.user.userttubeot.user.domain.dto.CustomUserDetails;
import com.user.userttubeot.user.domain.dto.FriendInfoDto;
import com.user.userttubeot.user.domain.dto.FriendRequestDto;
import com.user.userttubeot.user.domain.dto.FriendResponseDto;
import com.user.userttubeot.user.domain.exception.CoinAlreadySentException;
import com.user.userttubeot.user.domain.exception.FriendNotFoundException;
import com.user.userttubeot.user.domain.exception.ResponseMessage;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 친구 요청 및 정보 조회 관련 컨트롤러
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/friend")
public class FriendController {

    private static final Integer DAILY_COIN = 100;
    private final FriendService friendService;

    /**
     * 친구 요청을 전송하는 엔드포인트.
     */
    @PostMapping("/tag")
    public ResponseEntity<?> sendFriendRequest(
        @RequestHeader Map<String, String> headers,
        @RequestBody FriendRequestDto friendRequest) {

        // 요청 헤더 로그 출력
        headers.forEach((key, value) -> log.info("Header '{}': {}", key, value));

        // 요청 바디 로그 출력
        log.info("[친구 요청 바디] 요청 내용: {}", friendRequest);

        Integer userId = friendRequest.getUserId();
        Integer friendRequestId = friendRequest.getFriendId();
        log.info("[친구 요청 바디] 사용자 ID: {}, 친구 요청 대상 ID: {}", userId, friendRequestId);

        try {
            FriendResponseDto friendResponseDto = friendService.handleFriendRequest(userId,
                friendRequestId);
            return ResponseEntity.ok(friendResponseDto);
        } catch (FriendNotFoundException e) {
            log.warn("[친구 요청 실패 - 친구 없음] 사용자 ID: {}, 친구 요청 대상 ID: {}", userId, friendRequestId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseMessage("친구 관계가 존재하지 않습니다."));
        } catch (Exception e) {
            log.error("[친구 요청 실패 - 서버 오류] 사용자 ID: {}, 에러: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류로 친구 요청을 전송하지 못했습니다."));
        }
    }


    /**
     * 친구 정보 리스트를 조회하는 엔드포인트.
     */
    @GetMapping("/info-list")
    public ResponseEntity<?> getFriendInfoList(
        @AuthenticationPrincipal CustomUserDetails userDetails) {
        Integer userId = userDetails.getUserId();
        log.info("[친구 정보 조회 요청] 사용자 ID: {}", userId);

        try {
            List<FriendInfoDto> friendInfoList = friendService.getFriendInfoList(userId);
            log.info("[친구 정보 조회 성공] 사용자 ID: {}, 친구 수: {}", userId, friendInfoList.size());
            return ResponseEntity.ok(friendInfoList);
        } catch (Exception e) {
            log.error("[친구 정보 조회 실패] 사용자 ID: {}, 에러: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류로 친구 정보를 조회하지 못했습니다."));
        }
    }

    /**
     * 친구에게 데일리 코인을 전송하는 엔드포인트.
     */
    @GetMapping("/send-coin/{friendId}")
    public ResponseEntity<ResponseMessage> sendCoin(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable("friendId") Integer friendId) {

        Integer userId = userDetails.getUserId();
        log.info("[코인 전송 요청] 사용자 ID: {}, 친구 ID: {}", userId, friendId);

        try {
            ResponseMessage responseMessage = friendService.dailyCoinSend(userId, friendId,
                DAILY_COIN);
            log.info("[코인 전송 성공] 사용자 ID: {}, 친구 ID: {}", userId, friendId);
            return ResponseEntity.ok(responseMessage);
        } catch (CoinAlreadySentException e) {
            log.warn("[코인 전송 실패 - 이미 전송 완료] 사용자 ID: {}, 친구 ID: {}", userId, friendId);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseMessage("오늘 이미 코인이 전송되었습니다."));
        } catch (FriendNotFoundException e) {
            log.error("[코인 전송 실패 - 친구 없음] 사용자 ID: {}, 친구 ID: {}", userId, friendId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ResponseMessage("친구 관계가 존재하지 않습니다."));
        } catch (Exception e) {
            log.error("[코인 전송 실패 - 서버 오류] 사용자 ID: {}, 친구 ID: {}, 에러: {}", userId, friendId,
                e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류로 코인을 전송하지 못했습니다."));
        }
    }

    /**
     * 친구 여부를 확인하는 엔드포인트.
     */
    @GetMapping("/check-friend/{userId}/{friendId}")
    public ResponseEntity<ResponseMessage> checkFriend(
        @PathVariable Integer userId,
        @PathVariable Integer friendId) {

        log.info("[친구 여부 확인 요청] 사용자 ID: {}, 친구 ID: {}", userId, friendId);

        try {
            boolean areFriends = friendService.areFriends(userId, friendId);
            if (areFriends) {
                return ResponseEntity.ok(new ResponseMessage("친구입니다."));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseMessage("친구가 아닙니다."));
            }
        } catch (Exception e) {
            log.error("[친구 여부 확인 실패] 사용자 ID: {}, 친구 ID: {}, 에러: {}", userId, friendId,
                e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage("서버 오류로 친구 여부를 확인하지 못했습니다."));
        }
    }

}
