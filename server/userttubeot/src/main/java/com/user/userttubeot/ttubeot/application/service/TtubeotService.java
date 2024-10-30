package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotNameRegisterRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoListDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import java.util.List;

public interface TtubeotService {

    // 뚜벗 로그 추가
    void addTtubeotLog(Long userTtubeotOwnershipId, TtubeotLogRequestDTO ttubeotLogRequestDTO);

    // 유저의 뚜벗 아이디 조회
    Long getTtubeotOwnershipId(int userId); // 상태가 정상(0)인것을 반환합니다.

    // 유저의 뚜벗 상세 정보 조회
    UserTtubeotInfoResponseDTO getDdubeotInfo(int userId);

    // 뚜벗 뽑기
    TtubeotDrawResponseDTO drawTtubeot(TtubeotDrawRequestDTO ttubeotDrawRequestDTO);

    // 뽑은 뚜벗의 이름 등록
    void registerTtubeotName(TtubeotNameRegisterRequestDTO ttubeotNameRegisterRequestDTO);

    // 뚜벗 졸업앨범 조회
    UserTtubeotGraduationInfoListDTO getUserTtubeotGraduationInfoList(int userId);

}
