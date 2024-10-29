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
