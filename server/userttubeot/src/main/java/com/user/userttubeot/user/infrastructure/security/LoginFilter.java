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
    protected void successfulAuthentication(HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain, Authentication authResult) {

        CustomUserDetails customUserDetails = (CustomUserDetails) authResult.getPrincipal();
        String userPhone = customUserDetails.getUsername();
        Integer userId = customUserDetails.getUserId();

        String accessToken = jwtUtil.createAccessToken(userId, userPhone);
        String refreshToken = jwtUtil.createRefreshToken(userId, userPhone);

        redisService.setValues("refresh_" + userPhone, refreshToken, Duration.ofDays(1));

        response.setHeader("Authorization", "Bearer " + accessToken);
        response.addCookie(cookieUtil.createCookie("refresh", refreshToken));

        log.info("로그인 성공 - userId: {}, userPhone: {}", userId, userPhone);
        log.debug("AccessToken: {}", accessToken);
        log.debug("RefreshToken: {}", refreshToken);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, AuthenticationException failed) throws IOException {

        log.warn("로그인 실패 - Exception: {}", failed.getMessage());

        if (failed instanceof BadCredentialsException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("잘못된 로그인 정보입니다.");
        } else if (failed instanceof UsernameNotFoundException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("존재하지 않는 계정입니다.");
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("로그인 요청이 올바르지 않습니다.");
        }
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
