package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.MissionRewardRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.MissionRewardResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.RecentBreakupTtubeotResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogListResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotNameRegisterRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotExperienceResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGetIdRespDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoListDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInterestResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotMissionListResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.MissionRegistToDbDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.TtubeotRegistToDbDTO;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import org.springframework.http.ResponseEntity;

public interface TtubeotService {

    // 뚜벗 로그 추가
    UserTtubeotExperienceResponseDTO addTtubeotLog(Integer userId,
        TtubeotLogRequestDTO ttubeotLogRequestDTO);

    // 유저의 뚜벗 아이디 조회
    Long getTtubeotOwnershipId(int userId); // 상태가 정상(0)인것을 반환합니다.

    // 유저의 뚜벗 상세 정보 조회
    UserTtubeotInfoResponseDTO getDdubeotInfo(int userId);

    // 뚜벗 뽑기
    TtubeotDrawResponseDTO drawTtubeot(Integer userId, TtubeotDrawRequestDTO ttubeotDrawRequestDTO);

    // 뽑은 뚜벗의 이름 등록
    void registerTtubeotName(TtubeotNameRegisterRequestDTO ttubeotNameRegisterRequestDTO);

    // 뚜벗 졸업앨범 조회
    UserTtubeotGraduationInfoListDTO getUserTtubeotGraduationInfoList(int userId);

    // 뚜벗 랜덤뽑기
    TtubeotDrawResponseDTO drawRandomTtubeot(Integer userId);

    // 뚜벗 확정 뽑기 (특정 ID)
    TtubeotDrawResponseDTO drawFixedTtubeot(Integer userId, Integer ttubeotId);

    // 뚜벗 등급 뽑기
    TtubeotDrawResponseDTO drawTtubeotByGrade(Integer userId, Integer grade);

    // 뚜벗 상태 확인
    ResponseEntity<TtubeotLogListResponseDTO> checkTtubeotStatus(Integer userId);

    // 뚜벗 등록 (backend)
    void registTtubeot(TtubeotRegistToDbDTO ttubeotRegistToDbDTO);

    // 미션 등록 (backend)
    void registMission(MissionRegistToDbDTO missionRegistDTO);

    // 유저 뚜벗의 일일미션 정보를 조회
    UserTtubeotMissionListResponseDTO getUserDailyMissionList(int userId);

    // 유저 뚜벗의 주간미션 정보를 조회
    UserTtubeotMissionListResponseDTO getUserWeeklyMissionList(int userId);

    // 미션 갱신 후 보상 지급
    MissionRewardResponseDTO requestCoin(int userId,
        MissionRewardRequestDTO missionRewardRequestDTO);

    // 가장 최근에 헤어진 뚜벗 조회
    RecentBreakupTtubeotResponseDTO getRecentBreakUpTtubeot(int userId);

    // 보유 뚜벗의 관심도 조회
    UserTtubeotInterestResponseDTO getTtubeotInterest(int userId);

    // ID로 뚜벗 ID 찾기
    UserTtubeotGetIdRespDTO findTtubeotIdByOwnershipId(Long ttubeotOwnershipId);

    // 뚜벗 interest 변화
    UserTtuBeotOwnership changeTtubeotInterest(Long ttubeotInterestId, Integer mount);

    UserTtuBeotOwnership getUserTtuBeotOwnership(int userId);

    boolean deleteUserTtuBeotOwnership(Long ttubeotInterestId);
}
