package com.user.userttubeot.user.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.user.userttubeot.user.application.RedisService;
import com.user.userttubeot.user.domain.dto.CustomUserDetails;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final RedisService redisService;
    private final CookieUtil cookieUtil;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
        HttpServletResponse response) throws AuthenticationException {

        String userPhone;
        String password;

        try {
            var requestBody = new ObjectMapper().readValue(request.getReader(), Map.class);
            userPhone = (String) requestBody.get("user_phone");
            password = (String) requestBody.get("password");
        } catch (IOException e) {
            log.warn("잘못된 요청 형식으로 인해 로그인 실패 - Exception: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            throw new RuntimeException("잘못된 요청 형식입니다.", e);
        }

        User user = findUserByPhone(userPhone, response);
        validatePassword(password, user, response);

        var authRequest = new UsernamePasswordAuthenticationToken(userPhone,
            password + user.getUserPasswordSalt());
        return authenticationManager.authenticate(authRequest);
    }

    @Override
    protected void successfulAuthentication(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain,
        Authentication authResult) throws IOException {

        CustomUserDetails customUserDetails = (CustomUserDetails) authResult.getPrincipal();
        Integer userId = customUserDetails.getUserId();

        String accessToken = jwtUtil.createAccessToken(userId, customUserDetails.getUsername());
        String refreshToken = jwtUtil.createRefreshToken(userId, customUserDetails.getUsername());

        // Refresh Token을 Redis에 저장
        redisService.setValues("refresh_" + customUserDetails.getUsername(), refreshToken,
            Duration.ofDays(1));

        // Authorization 헤더에 Access Token 추가
        response.setHeader("Authorization", "Bearer " + accessToken);
        response.addCookie(cookieUtil.createCookie("refresh", refreshToken));

        // JSON 응답 생성 (message와 userId 포함)
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonResponse = String.format("{\"message\": \"로그인 성공\", \"userId\": %d}", userId);

        // 응답에 JSON 작성
        response.getWriter().write(jsonResponse);

        log.info("로그인 성공 - userId: {}", userId);
        log.debug("AccessToken: {}", accessToken);
        log.debug("RefreshToken: {}", refreshToken);
    }


    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException failed) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String message;

        if (failed instanceof BadCredentialsException) {
            message = "전화번호 혹은 비밀번호가 일치하지 않습니다.";
        } else if (failed.getMessage().contains("disabled")) {
            message = "현 서비스에서 사용할 수 없는 계정입니다.";
        } else {
            message = "알 수 없는 인증 오류가 발생했습니다.";
        }

        // JSON 응답 생성
        String jsonResponse = String.format("{\"message\": \"%s\"}", message);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(jsonResponse);

        log.warn("로그인 실패 - 이유: {}", message);
    }


    // 비밀번호 검증 메서드
    private boolean isPasswordValid(String rawPassword, String storedHash, String salt) {
        String combinedPassword = rawPassword + salt;
        return passwordEncoder.matches(combinedPassword, storedHash);
    }

    private User findUserByPhone(String userPhone, HttpServletResponse response) {
        return userRepository.findByUserPhone(userPhone)
            .orElseThrow(() -> {
                log.warn("로그인 실패 - 존재하지 않는 사용자, userPhone: {}", userPhone);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
            });
    }

    private void validatePassword(String rawPassword, User user, HttpServletResponse response) {
        if (!isPasswordValid(rawPassword, user.getUserPassword(), user.getUserPasswordSalt())) {
            log.warn("로그인 실패 - 잘못된 비밀번호, userPhone: {}", user.getUserPhone());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            throw new BadCredentialsException("비밀번호가 잘못되었습니다.");
        }
    }
}
