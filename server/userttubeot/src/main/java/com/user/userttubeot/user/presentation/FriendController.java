package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.FriendService;
import com.user.userttubeot.user.domain.dto.CustomUserDetails;
import com.user.userttubeot.user.domain.dto.FriendInfoDto;
import com.user.userttubeot.user.domain.dto.FriendRequestDto;
import com.user.userttubeot.user.domain.exception.ResponseMessage;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 친구 요청 및 정보 조회 관련 컨트롤러
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/friend")
public class FriendController {

    private final FriendService friendService;

    /**
     * 친구 요청을 전송하는 엔드포인트.
     */
    @PostMapping("/add")
    public ResponseEntity<?> sendFriendRequest(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestBody FriendRequestDto friendRequest) {

        Integer userId = userDetails.getUserId();
        Integer friendRequestId = friendRequest.getFriendId();
        log.info("친구 요청 - 사용자 ID: {}, 친구 요청 대상 ID: {}", userId, friendRequestId);

        try {
            friendService.sendFriendRequest(userId, friendRequestId);
            log.info("친구 요청 성공 - 사용자 ID: {}, 친구 요청 대상 ID: {}", userId, friendRequestId);
            return ResponseEntity.ok(new ResponseMessage("친구 요청이 전송되었습니다."));
        } catch (Exception e) {
            log.error("친구 요청 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ResponseMessage(e.getMessage()));
        }
    }

    /**
     * 친구 정보 리스트를 조회하는 엔드포인트.
     */
    @GetMapping("/info-list")
    public ResponseEntity<?> getFriendInfoList(
        @AuthenticationPrincipal CustomUserDetails userDetails) {

        Integer userId = userDetails.getUserId();
        log.info("친구 정보 조회 요청 - 사용자 ID: {}", userId);

        try {
            List<FriendInfoDto> friendInfoList = friendService.getFriendInfoList(userId);
            log.info("친구 정보 조회 성공 - 사용자 ID: {}, 친구 수: {}", userId, friendInfoList.size());
            return ResponseEntity.ok(friendInfoList);
        } catch (Exception e) {
            log.error("친구 정보 조회 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ResponseMessage(e.getMessage()));
        }
    }
}
