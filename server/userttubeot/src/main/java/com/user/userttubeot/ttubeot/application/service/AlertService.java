package com.user.userttubeot.ttubeot.application.service;

public interface AlertService {

    void updateFcmTokenForUser(
        com.user.userttubeot.ttubeot.domain.dto.FcmTokenRequestDTO fcmTokenRequestDTO);

    void sendMissionNotification(String fcmToken, String title, String body);

    void getUserInfoAndSendNotification(Integer userId);
}
