package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.backend.UserInfoAdventureRequestDTO;

public interface AlertService {

    void updateFcmTokenForUser(
        com.user.userttubeot.ttubeot.domain.dto.FcmTokenRequestDTO fcmTokenRequestDTO);

    void sendMissionNotaification(String fcmToken, String title, String body);

    void getUserInfoAndSendNotification(Integer userId);
}
