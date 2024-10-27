package com.user.userttubeot.user.application;

import com.user.userttubeot.user.global.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
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

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 리프레시 토큰 추출 (예를 들어 refresh_token이라는 쿠키 이름을 사용)
        String refreshToken = getRefreshTokenFromCookies(request);

        // 리프레시 토큰 검증
        if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
            // 리프레시 토큰에서 사용자 정보 추출
            String userPhone = jwtTokenProvider.getUserPhoneFromToken(refreshToken);

            // 새로운 액세스 토큰 생성
            String newAccessToken = jwtTokenProvider.generateAccessToken(userPhone);

            // 응답 헤더에 새로운 액세스 토큰 포함
            response.setHeader("Authorization", "Bearer:" + newAccessToken);

            // 리프레시 토큰 만료 시, 새 리프레시 토큰 발급 후 쿠키로 설정
            if (jwtTokenProvider.isTokenExpiringSoon(refreshToken)) {
                String newRefreshToken = jwtTokenProvider.generateRefreshToken(userPhone);
                response.addHeader("Set-Cookie",
                    "refresh token:" + newRefreshToken + "; HttpOnly; Path=/; Max-Age=" + (7 * 24
                        * 60 * 60));
            }
        } else {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("refresh token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}