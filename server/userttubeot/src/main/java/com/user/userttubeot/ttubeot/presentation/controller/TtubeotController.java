package com.user.userttubeot.ttubeot.presentation.controller;

import com.user.userttubeot.ttubeot.application.service.TtubeotService;
import com.user.userttubeot.ttubeot.application.service.TtubeotServiceImpl;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotIdResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("user/ttubeot")
public class TtubeotController {

    private final TtubeotServiceImpl ttubeotService;

    // 뚜벗 로그 추가
    @PostMapping("/logs")
    public ResponseEntity<?> addTtubeotLog(@RequestBody TtubeotLogRequestDTO ttubeotLogRequestDTO) {
        int userTtubeotId = ttubeotLogRequestDTO.getUserTtubeotOwnershipId();
        ttubeotService.addTtubeotLog(userTtubeotId, ttubeotLogRequestDTO);

        return ResponseEntity.ok("로그가 성공적으로 추가되었습니다.");
    }

    // 유저의 뚜벗 상세 정보 조회 -> 정상인 것만. (모험 사용)
    @GetMapping("/adventure/{userId}/details")
    public ResponseEntity<?> getDdubeotInfo(@PathVariable int userId) {
        UserTtubeotInfoResponseDTO ttubeotInfo = ttubeotService.getDdubeotInfo(userId);
        return ResponseEntity.ok(ttubeotInfo);
    }

    // 회원의 뚜ㅃ서 아이디 조회 (모험 사용)
    @GetMapping("/adventure/{userId}/id")
    public ResponseEntity<?> getDdubeotId(@PathVariable int userId) {
        int ttubeotId = ttubeotService.getTtubeotOwnershipId(userId);
        UserTtubeotIdResponseDTO responseDTO = new UserTtubeotIdResponseDTO(ttubeotId);
        return ResponseEntity.ok(responseDTO);
    }


}
