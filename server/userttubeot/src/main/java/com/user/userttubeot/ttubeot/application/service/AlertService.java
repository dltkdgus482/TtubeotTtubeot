package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.backend.FcmTokenAdventureRequestDTO;

public interface AlertService {

    void updateFcmTokenForUser(
        com.user.userttubeot.ttubeot.domain.dto.FcmTokenRequestDTO fcmTokenRequestDTO);

    void sendMissionNotaification(String fcmToken, String title, String body);

    // fcm토큰 조회
    FcmTokenAdventureRequestDTO getFcmToken(Integer userId);
}
