package com.user.userttubeot.tokeninterceptor.application.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenInterceptorService {

    @Value("${spring.jwt.secret}")
    private String SECRET_KEY;

    // JWT 토큰에서 Claims 객체를 추출
    public Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getSecretKey()) // 비밀 키 설정
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (Exception e) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }
    }

    // JWT에서 userId 추출
    public Integer extractUserIdFromToken(String token) {
        Claims claims = parseClaims(token);
        if (claims == null || claims.getSubject() == null) {
            throw new IllegalArgumentException("토큰에서 유효한 userId를 찾을 수 없습니다.");
        }
        return Integer.parseInt(claims.getSubject()); // userId가 subject에 저장된다고 가정
    }

    // SecretKey 객체 생성
    private Key getSecretKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

}
