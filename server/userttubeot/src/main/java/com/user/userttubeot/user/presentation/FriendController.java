package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.FriendService;
import com.user.userttubeot.user.domain.dto.CustomUserDetails;
import com.user.userttubeot.user.domain.dto.FriendRequestDto;
import com.user.userttubeot.user.domain.exception.ResponseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/friend")
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/add")
    public ResponseEntity<?> sendFriendRequest(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestBody FriendRequestDto friendRequest) {

        Integer userId = userDetails.getUserId();
        Integer friendRequestId = friendRequest.getFriendId();
        log.info("친구 요청 - 사용자 ID: {}, 친구 요청 대상 ID: {}", userId, friendRequestId);

        try {
            friendService.sendFriendRequest(userId, friendRequestId);
            return ResponseEntity.ok(new ResponseMessage("친구 요청이 전송되었습니다."));
        } catch (Exception e) {
            log.error("친구 요청 실패 - 서버 오류: {}", e.getMessage());
            return ResponseEntity.status(500).body(new ResponseMessage(e.getMessage()));
        }
    }


}
