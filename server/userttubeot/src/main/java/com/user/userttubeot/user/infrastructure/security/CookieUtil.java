package com.user.userttubeot.user.infrastructure.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CookieUtil {

    public Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24 * 60 * 60); // 1일
        cookie.setHttpOnly(true);
        cookie.setPath("/"); // 쿠키가 전체 경로에서 유효하도록 설정
        return cookie;
    }

    public String extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            log.warn("쿠키가 없습니다.");
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if ("refresh".equals(cookie.getName())) {
                log.info("리프레시 토큰 추출 성공 - 토큰: {}", cookie.getValue());
                return cookie.getValue();
            }
        }
        log.warn("리프레시 토큰 쿠키가 존재하지 않습니다.");
        return null;
    }
}
