package com.user.userttubeot.user.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
        HttpServletResponse response)
        throws AuthenticationException {

        String userPhone = obtainUserPhone(request);
        String password = obtainPassword(request);

        log.info("로그인 시도:{}", userPhone);

        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
            userPhone, password, null);

        return authenticationManager.authenticate(authRequest);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, FilterChain chain, Authentication authResult)
        throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, AuthenticationException failed)
        throws IOException, ServletException {
        super.unsuccessfulAuthentication(request, response, failed);
    }

    protected String obtainUserPhone(HttpServletRequest request) {
        try {
            // 요청 Body를 읽어 Map 형태로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            var requestBody = objectMapper.readValue(request.getReader(),
                Map.class);

            // 요청 Body에서 전화번호 추출
            return requestBody.get("user_phone").toString();
        } catch (IOException e) {
            log.error("전화번호를 추출하는 데 오류 발생: {}", e.getMessage());
            return null; // 예외 발생 시 null 반환 (필요에 따라 다른 처리를 할 수 있음)
        }
    }

    // 로그인 경로를 변경할 메서드
    @Override
    public void setFilterProcessesUrl(String url) {
        super.setFilterProcessesUrl(url); // 원하는 로그인 경로 설정
    }

}
