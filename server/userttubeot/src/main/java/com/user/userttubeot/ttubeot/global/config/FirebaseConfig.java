package com.user.userttubeot.ttubeot.global.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebaseApp() throws IOException {
        // Firebase 서비스 계정 키 파일 경로
        String firebaseKeyPath = "src/main/resources/ttubeotttubeot-firebase-key.json";

        // Firebase 옵션 설정
        FileInputStream serviceAccount = new FileInputStream(firebaseKeyPath);
        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();

        // Firebase 앱 초기화 (중복 초기화를 방지)
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
            System.out.println("Firebase 앱이 초기화되었습니다.");
        }
    }
}
