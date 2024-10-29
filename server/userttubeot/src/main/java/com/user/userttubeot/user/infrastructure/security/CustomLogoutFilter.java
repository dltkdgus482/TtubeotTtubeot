package com.user.userttubeot.user.infrastructure.security;

import com.user.userttubeot.user.application.RedisService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.GenericFilterBean;

@Slf4j
@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

    private final JWTUtil jwtUtil;
    private final RedisService redisService;
    private final CookieUtil cookieUtil;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
        handleLogoutRequest((HttpServletRequest) request, (HttpServletResponse) response, chain);
    }

    private void handleLogoutRequest(HttpServletRequest request, HttpServletResponse response,
        FilterChain filterChain) throws ServletException, IOException {

        if (!isLogoutRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String refresh = cookieUtil.extractRefreshToken(request);
        if (refresh == null) {
            log.warn("로그아웃 실패 - 리프레시 토큰이 없습니다.");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if (!validateRefreshToken(refresh, response)) {
            return;
        }

        performLogout(response, refresh);
        log.info("로그아웃 성공 - 리프레시 토큰 제거 완료");
    }

    private boolean isLogoutRequest(HttpServletRequest request) {
        return "/user/logout".equals(request.getRequestURI()) && "POST".equals(request.getMethod());
    }

    private boolean validateRefreshToken(String refresh, HttpServletResponse response) {
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            log.warn("로그아웃 실패 - 만료된 리프레시 토큰");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return false;
        }

        String key = "refresh_" + jwtUtil.getUserPhone(refresh);
        if (!refresh.equals(redisService.getValue(key))) {
            log.warn("로그아웃 실패 - DB에 저장된 리프레시 토큰과 일치하지 않음");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return false;
        }
        return true;
    }

    private void performLogout(HttpServletResponse response, String refresh) {
        redisService.deleteValue("refresh_" + jwtUtil.getUserPhone(refresh));
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }

}
