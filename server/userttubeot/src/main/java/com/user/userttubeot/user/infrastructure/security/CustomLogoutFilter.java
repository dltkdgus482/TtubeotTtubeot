package com.user.userttubeot.user.infrastructure.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.user.userttubeot.user.application.RedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.filter.GenericFilterBean;

@Slf4j
@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

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

        // 요청 바디에서 userphone 값을 추출
        String userphone = extractUserphoneFromRequest(request);
        if (userphone == null || userphone.isEmpty()) {
            log.warn("로그아웃 실패 - userphone이 없습니다.");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // 리프레시 토큰을 Redis에서 삭제
        performLogout(response, userphone);
        log.info("로그아웃 성공 - 리프레시 토큰 제거 완료");
    }

    private boolean isLogoutRequest(HttpServletRequest request) {
        return "/user/logout".equals(request.getRequestURI()) && "POST".equals(request.getMethod());
    }

    /**
     * 요청 바디에서 userphone을 추출하는 메서드
     */
    private String extractUserphoneFromRequest(HttpServletRequest request) {
        try {
            StringBuilder stringBuilder = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
            }
            String body = stringBuilder.toString();

            // JSON 파싱 (예: Jackson 라이브러리 사용)
            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(body);

            // userphone 필드가 있는지 확인
            JsonNode userphoneNode = jsonNode.get("userphone");
            if (userphoneNode != null) {
                return userphoneNode.asText();
            } else {
                log.warn("userphone 필드가 요청 바디에 없습니다.");
                return null;
            }
        } catch (IOException e) {
            log.error("요청 바디에서 userphone을 추출하는 중 오류 발생", e);
            return null;
        }
    }


    private void performLogout(HttpServletResponse response, String userPhone) {
        // Redis에서 userphone을 키로 사용하여 리프레시 토큰을 삭제
        String redisKey = "refresh_" + userPhone;
        if (redisService.getValue(redisKey) != null) {
            redisService.deleteValue(redisKey);
            log.info("Redis에서 리프레시 토큰 삭제 완료 - userphone: {}", userPhone);
        } else {
            log.warn("로그아웃 요청 - Redis에 저장된 리프레시 토큰이 없습니다. 이미 로그아웃된 상태이거나 토큰이 만료되었습니다. userphone: {}", userPhone);
            // 이미 로그아웃된 상태로 간주하여 성공 응답을 반환
        }

        // 쿠키에서 리프레시 토큰 제거
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        // 로그아웃 성공 상태 코드 설정
        response.setStatus(HttpServletResponse.SC_OK);
    }

}
