package com.user.userttubeot.ttubeot.application.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.user.userttubeot.ttubeot.domain.dto.FcmTokenRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.UserInfoAdventureRequestDTO;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void updateFcmTokenForUser(FcmTokenRequestDTO fcmTokenRequestDTO) {
        User user = userRepository.findByUserId(fcmTokenRequestDTO.getUserId())
            .orElseThrow(() -> new IllegalArgumentException(
                "유저를 찾을 수 없습니다. ID: " + fcmTokenRequestDTO.getUserId()));

        String newFcmToken = fcmTokenRequestDTO.getFcmToken();
        if (newFcmToken != null && !newFcmToken.isEmpty() && !newFcmToken.equals(
            user.getFcmToken())) {
            // 기존 FCM 토큰과 다를 때만 업데이트 수행
            userRepository.updateFcmTokenByUserId(user.getUserId(), newFcmToken);
        }
    }

    @Override
    public void sendMissionNotaification(String fcmToken, String title, String body) {
        Message message = Message.builder()
            .setToken(fcmToken)
            .setNotification(Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build())
            .putData("title", title)
            .putData("body", body)
            .build();
        try {
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("✅ FCM Message 전송 성공: " + response);
        } catch (Exception e) {
            System.out.println("❌ FCM Message 전송 실패: " + e.getMessage());
        }
    }

    @Override
    public void getUserInfoAndSendNotification(Integer userId) {
        // 1. 유저 정보 조회
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다."));

        // 2. FCM Token 확인
        String fcmToken = user.getFcmToken();
        if (fcmToken == null || fcmToken.isEmpty()) {
            throw new IllegalArgumentException("유저의 FCM 토큰이 없습니다");
        }

        String personalizedBody = String.format("%s님, 방금 다녀오신 모험의 사진이 등록되었습니다. 추억을 공유해 보세요!",
            user.getUserName());

        // 3. 알림 전송
        sendMissionNotaification(fcmToken, "새로운 모험 사진이 도착했어요!",
            personalizedBody);

    }
}
