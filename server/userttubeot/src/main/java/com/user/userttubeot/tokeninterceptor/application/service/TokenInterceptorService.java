package com.user.userttubeot.tokeninterceptor.application.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
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
        } catch (ExpiredJwtException e) {
            throw new IllegalArgumentException("만료된 토큰입니다.", e);
        } catch (UnsupportedJwtException e) {
            throw new IllegalArgumentException("지원되지 않는 토큰 형식입니다.", e);
        } catch (MalformedJwtException e) {
            throw new IllegalArgumentException("잘못된 토큰 형식입니다.", e);
        } catch (SignatureException e) {
            throw new IllegalArgumentException("토큰 서명이 잘못되었습니다.", e);
        } catch (Exception e) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.", e);
        }
    }


    // JWT에서 userId 추출
    public Integer extractUserIdFromToken(String token) {
        try {
            Claims claims = parseClaims(token);

            // claims가 null이거나 userId가 없는 경우 예외 발생
            if (claims == null || !claims.containsKey("userId")) {
                throw new IllegalArgumentException("토큰에서 유효한 userId를 찾을 수 없습니다.");
            }

            // userId가 subject에 저장된다고 가정, 숫자 형식 여부 검증
            return claims.get("userId", Integer.class);


        } catch (Exception e) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.", e);
        }
    }

    // SecretKey 객체 생성
    private Key getSecretKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

}
