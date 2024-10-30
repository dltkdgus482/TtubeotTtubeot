package com.user.userttubeot.user.global.config;

import com.user.userttubeot.user.application.RedisService;
import com.user.userttubeot.user.domain.repository.UserRepository;
import com.user.userttubeot.user.infrastructure.security.CookieUtil;
import com.user.userttubeot.user.infrastructure.security.CustomLogoutFilter;
import com.user.userttubeot.user.infrastructure.security.JWTFilter;
import com.user.userttubeot.user.infrastructure.security.JWTUtil;
import com.user.userttubeot.user.infrastructure.security.LoginFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final RedisService redisService;
    private final CookieUtil cookieUtil;

    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
        throws Exception {
        return configuration.getAuthenticationManager();
    }

    // PasswordEncoder 빈 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(AbstractHttpConfigurer::disable);// CSRF 비활성화
        http
            .formLogin(AbstractHttpConfigurer::disable);// 폼 로그인 비활성화
        http
            .httpBasic(AbstractHttpConfigurer::disable);// Http basic 비활성화

        // 경로별 인가 작업
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/user/login", "/user/reissue", "/user/check-username",
                    "/user/signup", "/user/logout",
                    "/user/change-password", "/user/sms-verification/request",
                    "/user/sms-verification/confirm", "/user/auth/**", "/healthz").permitAll()
                .anyRequest().authenticated());

        LoginFilter loginFilter = new LoginFilter(
            authenticationManager(authenticationConfiguration), userRepository,
            new BCryptPasswordEncoder(), jwtUtil, redisService, cookieUtil);
        loginFilter.setFilterProcessesUrl("/user/login");

        UsernamePasswordAuthenticationFilter usernamePasswordAuthenticationFilter = new UsernamePasswordAuthenticationFilter();

        usernamePasswordAuthenticationFilter.setFilterProcessesUrl("/user/login");
        usernamePasswordAuthenticationFilter.setUsernameParameter("user_phone");

        http
            .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);

        http
            .addFilterBefore(new CustomLogoutFilter(jwtUtil, redisService, cookieUtil),
                LogoutFilter.class);

        http
            .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        // 세션 설정
        http.sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
