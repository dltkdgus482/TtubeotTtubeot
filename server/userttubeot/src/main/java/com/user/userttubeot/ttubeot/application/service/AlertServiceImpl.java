package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.FcmTokenRequestDTO;
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
}
