package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;

public interface TtubeotService {

    // 뚜벗 로그 추가
    void addTtubeotLog(int userTtubeotOwnershipId, TtubeotLogRequestDTO ttubeotLogRequestDTO);

    // 유저의 뚜벗 아이디 조회
    int getTtubeotOwnershipId(int userId); // 상태가 정상(0)인것을 반환합니다.

    // 유저의 뚜벗 상세 정보 조회
    UserTtubeotInfoResponseDTO getDdubeotInfo(int userId);
}
