package com.user.userttubeot.user.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
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
            throw new RuntimeException(e);
        }

        // 사용자 조회
        User user = userRepository.findByUserPhone(userPhone)
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        String salt = user.getUserPasswordSalt();

        // 비밀번호 검증
        if (!isPasswordValid(password, user.getUserPassword(), salt)) {
            throw new BadCredentialsException("비밀번호가 잘못되었습니다.");
        }

        // 인증 요청을 위한 토큰 생성
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
            userPhone, password + salt);

        return authenticationManager.authenticate(authRequest);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, FilterChain chain, Authentication authResult) {
        log.info("로그인 성공: {}", authResult.getName());
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
        HttpServletResponse response, AuthenticationException failed)
        throws IOException, ServletException {
        log.info("로그인 실패: {}", failed.getMessage());
        super.unsuccessfulAuthentication(request, response, failed);
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
