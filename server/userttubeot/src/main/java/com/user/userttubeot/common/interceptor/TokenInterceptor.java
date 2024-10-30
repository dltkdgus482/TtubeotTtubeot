package com.user.userttubeot.common.interceptor;

import com.user.userttubeot.common.application.service.TokenInterceptorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class TokenInterceptor implements HandlerInterceptor {

    private final TokenInterceptorService tokenInterceptorService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
        Object handler) throws Exception {
        // Authorization 헤더에서 토큰을 가져옴
        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            // "Bearer " 접두사를 제거하고 공백 제거
            token = token.substring(7).trim();

            // userId 추출
            Integer userId = tokenInterceptorService.extractUserIdFromToken(token);

            // userId를 요청 속성에 추가
            request.setAttribute("userId", userId);
        } else {
            // 토큰이 없거나 잘못된 경우 예외 처리
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        return true;
    }

}
