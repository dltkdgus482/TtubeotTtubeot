package com.user.userttubeot.ttubeot.presentation.controller;

import com.user.userttubeot.ttubeot.application.service.AlertServiceImpl;
import com.user.userttubeot.ttubeot.application.service.TtubeotServiceImpl;
import com.user.userttubeot.ttubeot.domain.dto.FcmTokenRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.MissionRewardRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.MissionRewardResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.RecentBreakupTtubeotResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotNameRegisterRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtuBeotOwnershipDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoListDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotIdResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInterestResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotMissionListResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.MissionRegistToDbDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.TtubeotRegistToDbDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.UserInfoAdventureRequestDTO;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("user")
public class TtubeotController {

    private final TtubeotServiceImpl ttubeotService;
    private final AlertServiceImpl alertService;

    // 뚜벗 로그 추가
    @PostMapping("/auth/ttubeot/logs")
    public ResponseEntity<?> addTtubeotLog(@RequestAttribute("userId") Integer userId,
        @RequestBody TtubeotLogRequestDTO ttubeotLogRequestDTO) {
        ttubeotService.addTtubeotLog(userId, ttubeotLogRequestDTO);

        return ResponseEntity.ok("로그가 성공적으로 추가되었습니다.");
    }

    // 유저의 뚜벗 상세 정보 조회 -> 정상인 것만. (모험 사용)
    @GetMapping("/ttubeot/adventure/{userId}/details")
    public ResponseEntity<?> getDdubeotInfo(@PathVariable int userId) {
        UserTtubeotInfoResponseDTO ttubeotInfo = ttubeotService.getDdubeotInfo(userId);
        return ResponseEntity.ok(ttubeotInfo);
    }

    // 회원의 뚜벗 아이디 조회 (모험 사용)
    @GetMapping("/ttubeot/adventure/{userId}/id")
    public ResponseEntity<?> getDdubeotId(@PathVariable int userId) {
        Long ttubeotId = ttubeotService.getTtubeotOwnershipId(userId);
        UserTtubeotIdResponseDTO responseDTO = new UserTtubeotIdResponseDTO(ttubeotId);
        return ResponseEntity.ok(responseDTO);
    }

    // 뚜벗의 이름 등록
    @PostMapping("/ttubeot/name")
    public ResponseEntity<?> addTtubeotName(
        @RequestBody TtubeotNameRegisterRequestDTO ttubeotNameRegister) {
        try {
            ttubeotService.registerTtubeotName(ttubeotNameRegister);
            return ResponseEntity.ok("뚜벗의 이름이 성공적으로 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 ID에 해당하는 뚜벗 소유 정보가 없습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("뚜벗 이름 등록 중 오류가 발생했습니다.");
        }
    }

    // 졸업사진 정보 조회
    @GetMapping("/auth/ttubeot/graduation-info")
    public ResponseEntity<?> getTtubeotAlbum(@RequestAttribute("userId") Integer userId) {
        UserTtubeotGraduationInfoListDTO graduationInfoList = ttubeotService.getUserTtubeotGraduationInfoList(
            userId);

        return ResponseEntity.ok(graduationInfoList);
    }

    // 뚜벗 뽑기
    @PostMapping("/auth/ttubeot/draw")
    public ResponseEntity<?> drawTtubeot(@RequestAttribute("userId") Integer userId,
        @RequestBody TtubeotDrawRequestDTO TtubeotDrawRequest) {
        TtubeotDrawResponseDTO ttubeotDrawResponse = ttubeotService.drawTtubeot(userId,
            TtubeotDrawRequest);
        return ResponseEntity.ok(ttubeotDrawResponse);
    }

    // 뚜벗의 상태 조회
    @GetMapping("/auth/ttubeot/status")
    public ResponseEntity<?> getTtubeotStatus(@RequestAttribute("userId") Integer userId) {
        return ttubeotService.checkTtubeotStatus(userId);
    }

    // 유저 뚜벗의 일간 미션 목록 조회
    @GetMapping("/auth/ttubeot/daily")
    public ResponseEntity<?> getTtubeotDaily(@RequestAttribute("userId") Integer userId) {
        UserTtubeotMissionListResponseDTO userTtubeotMissionList = ttubeotService.getUserDailyMissionList(
            userId);
        return ResponseEntity.ok(userTtubeotMissionList);
    }

    // 유저 뚜벗의 주간 미션 목록 조회
    @GetMapping("/auth/ttubeot/weekly")
    public ResponseEntity<?> getTtubeotWeekly(@RequestAttribute("userId") Integer userId) {
        UserTtubeotMissionListResponseDTO userTtubeotMissionList = ttubeotService.getUserWeeklyMissionList(
            userId);
        return ResponseEntity.ok(userTtubeotMissionList);
    }

    // 최근 헤어진 뚜벗 정보 조회
    @GetMapping("/auth/ttubeot/recent-breakup")
    public ResponseEntity<?> getTtubeotRecentBreakup(@RequestAttribute("userId") Integer userId) {
        RecentBreakupTtubeotResponseDTO response = ttubeotService.getRecentBreakUpTtubeot(userId);
        // 최근에 헤어진 뚜벗이 없을 경우
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.ok(response);
    }

    // 미션 진행 중 뚜벗 재화 반영 요청
    @PostMapping("/auth/ttubeot/adventure/result")
    public ResponseEntity<?> requestTtubeotAdventureResult(
        @RequestAttribute("userId") Integer userId,
        @RequestBody MissionRewardRequestDTO missionRewardRequest) {

        // Service 호출
        MissionRewardResponseDTO responseDTO = ttubeotService.requestCoin(userId,
            missionRewardRequest);

        // 성공 응답 반환
        return ResponseEntity.ok(responseDTO);
    }

    // 유저가 키우고 있는 뚜벗의 관심도 조회
    @GetMapping("/auth/ttubeot/interest")
    public ResponseEntity<?> getTtubeotInterest(@RequestAttribute("userId") Integer userId) {
        UserTtubeotInterestResponseDTO userTtubeotInterest = ttubeotService.getTtubeotInterest(
            userId);
        return ResponseEntity.ok(userTtubeotInterest);
    }

    /*
     * api for firebase
     * */
    // fcm token 등록
    @PostMapping("/admin/update-fcm-token")
    public ResponseEntity<?> updateFcmToken(@RequestBody FcmTokenRequestDTO fcmTokenRequestDTO) {
        alertService.updateFcmTokenForUser(fcmTokenRequestDTO);
        return ResponseEntity.ok(fcmTokenRequestDTO);
    }

    /*
     * api for backend
     * */
    // 뚜벗 등록
    @PostMapping("/admin/ttubeot/register")
    public ResponseEntity<?> registerTtubeot(@RequestBody TtubeotRegistToDbDTO registTtubeot) {
        ttubeotService.registTtubeot(registTtubeot);
        return ResponseEntity.ok("뚜벗이 정상적으로 등록되었습니다.");
    }

    // 미션 등록
    @PostMapping("/admin/mission/register")
    public ResponseEntity<?> registerMission(@RequestBody MissionRegistToDbDTO registMission) {
        ttubeotService.registMission(registMission);
        return ResponseEntity.ok("미션이 정상적으로 등록되었습니다.");
    }

    // userId 조회
    @PostMapping("/ttubeot/user-info")
    public ResponseEntity<?> getUserInfo(@RequestBody UserInfoAdventureRequestDTO userInfo) {
        Integer userId = userInfo.getUserId();
        if (userId == null) {
            return ResponseEntity.badRequest().body("userId가 요청에 포함되어 있지 않습니다.");
        }

        try {
            // 알림서비스 호출
            alertService.getUserInfoAndSendNotification(userId);

            // 성공 응답 반환
            return ResponseEntity.ok("알림이 성공적으로 전송되었습니다.");
        } catch (IllegalArgumentException e) {
            // 유효하지 않은 데이터 처리
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // 기타 서버 에러 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("서버 오류가 발생했습니다. 관리자에게 문의하십시오.");
        }
    }

    @GetMapping("/ttubeot/find-ttubeot/{ttubeotOwnershipId}")
    public ResponseEntity<?> getTtubeotIdByOwnershipId(
        @PathVariable("ttubeotOwnershipId") Long ttubeotOwnershipId) {

        try {
            UserTtuBeotOwnershipDTO ttubeot = ttubeotService.findTtubeotIdByOwnershipId(
                ttubeotOwnershipId);
            return ResponseEntity.ok(ttubeot);
        } catch (RuntimeException e) {
            // 실패 시 NOT_FOUND 상태와 함께 메시지를 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                    "message", e.getMessage(),
                    "ttubeotOwnershipId", ttubeotOwnershipId
                ));
        }
    }

    @DeleteMapping("/ttubeot/{id}")
    public ResponseEntity<Void> deleteUserTtuBeotOwnership(@PathVariable Long id) {
        boolean isDeleted = ttubeotService.deleteUserTtuBeotOwnership(id);

        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204 No Content (삭제 성공)
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found (삭제 실패)
        }
    }

}
