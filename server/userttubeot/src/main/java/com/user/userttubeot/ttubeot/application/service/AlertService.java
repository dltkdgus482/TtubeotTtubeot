package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.FcmTokenRequestDTO;
import com.user.userttubeot.user.domain.entity.User;

public interface AlertService {

    void updateFcmTokenForUser(FcmTokenRequestDTO fcmTokenRequestDTO);

    void sendMissionNotaification(String fcmToken, String title, String body);
}
