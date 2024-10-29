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
    private final UserRepository userRepository; // UserRepository 추가
    private final BCryptPasswordEncoder passwordEncoder; // PasswordEncoder 주입
    private final JWTUtil jwtUtil;
    private final RedisService redisService;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
        HttpServletResponse response) throws AuthenticationException {
        ObjectMapper objectMapper = new ObjectMapper();
        String userPhone;
        String password;
        try {
            var requestBody = objectMapper.readValue(request.getReader(), Map.class);
            userPhone = requestBody.get("user_phone").toString();
            password = requestBody.get("password").toString();
        } catch (IOException e) {
            response.setStatus(400); // 잘못된 요청 방식
            throw new RuntimeException("잘못된 요청 방식입니다.", e);
        }

        User user = userRepository.findByUserPhone(userPhone)
            .orElseThrow(() -> {
                response.setStatus(401); // 잘못된 로그인 정보
                return new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
            });

        String salt = user.getUserPasswordSalt();

        if (!isPasswordValid(password, user.getUserPassword(), salt)) {
            response.setStatus(401); // 잘못된 로그인 정보
            throw new BadCredentialsException("비밀번호가 잘못되었습니다.");
        }

        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
            userPhone, password + salt);
        return authenticationManager.authenticate(authRequest);
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain,
        Authentication authResult) {
        log.info("로그인 성공: 사용자 이름 = {}", authResult.getName());

        // 사용자 정보 가져오기
        CustomUserDetails customUserDetails = (CustomUserDetails) authResult.getPrincipal();
        String userPhone = customUserDetails.getUsername();
        Integer userId = customUserDetails.getUserId();
        log.info("사용자 Id:{}, 전화번호: {}", userId, userPhone);

        // AccessToken 생성
        String accessToken = jwtUtil.createAccessToken(userId, userPhone);
        log.info("액세스 토큰 생성 완료");

        // RefreshToken 생성
        String refreshToken = jwtUtil.createRefreshToken(userId, userPhone);
        log.info("리프레시 토큰 생성 완료");

        // Redis에 리프레시 토큰 저장 (Duration으로 TTL 설정)
        redisService.setValues("refresh_" + userPhone, refreshToken, Duration.ofDays(1));

        // 헤더에 토큰 추가
        response.addHeader("Authorization", "Bearer " + accessToken);
        response.addHeader("Set-Cookie", "refresh token " + refreshToken);
        log.info("헤더에 액세스 및 리프레시 토큰 추가 완료");

        log.debug("AccessToken: {}", accessToken);  // 필요 시에만 출력
        log.debug("RefreshToken: {}", refreshToken); // 필요 시에만 출력
    }


    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, AuthenticationException failed) throws IOException {
        log.info("로그인 실패: {}", failed.getMessage());

        if (failed instanceof BadCredentialsException) {
            response.setStatus(401); // 잘못된 로그인 정보
            response.getWriter().write("잘못된 로그인 정보입니다.");
        } else if (failed instanceof UsernameNotFoundException) {
            response.setStatus(401); // 존재하지 않는 계정
            response.getWriter().write("존재하지 않는 계정입니다.");
        } else {
            response.setStatus(400); // 기본적으로 잘못된 요청
            response.getWriter().write("로그인 요청이 올바르지 않습니다.");
        }
    }

    // 비밀번호 검증 메서드
    private boolean isPasswordValid(String rawPassword, String storedHash, String salt) {
        String combinedPassword = rawPassword + salt;
        boolean isValid = passwordEncoder.matches(combinedPassword, storedHash);
        // matches 메서드를 사용하여 입력된 비밀번호와 저장된 해시를 비교
        log.info("비밀번호 검증: 입력된 비밀번호 + salt = {}, 저장된 해시 = {}, 검증 결과 = {}",
            combinedPassword, storedHash, isValid);
        return passwordEncoder.matches(rawPassword + salt, storedHash);
    }
}
