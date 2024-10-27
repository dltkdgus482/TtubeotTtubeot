package com.user.userttubeot.user.application;

import com.user.userttubeot.user.global.JwtTokenProvider;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public void login(String userPhone, String password, HttpServletResponse response) {
        // 사용자 인증 (UserService를 사용하여 사용자 확인)
        if (userService.verifyUserCredentials(userPhone, password)) {
            // 인증 성공 시 토큰 생성
            String accessToken = jwtTokenProvider.generateAccessToken(userPhone);
            String refreshToken = jwtTokenProvider.generateRefreshToken(userPhone);

            // Access Token을 Authorization 헤더에 포함
            response.setHeader("Authorization", "Bearer:" + accessToken);

            // Refresh Token을 Set-Cookie 헤더에 포함 (HttpOnly로 설정)
            response.addHeader("Set-Cookie",
                "refresh token:" + refreshToken + "; HttpOnly; Path=/; Max-Age=" + (7 * 24 * 60
                    * 60));
        } else {
            throw new IllegalArgumentException("Invalid userPhone or password");
        }
    }
}