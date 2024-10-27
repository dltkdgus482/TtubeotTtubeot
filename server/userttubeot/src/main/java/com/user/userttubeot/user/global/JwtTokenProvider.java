package com.user.userttubeot.user.global;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    // 256비트 이상의 강력한 키 생성
    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long ACCESS_TOKEN_EXPIRE_TIME = 1000 * 60 * 30; // 30분
    private final long REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7; // 7일

    public String generateAccessToken(String userId) {
        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRE_TIME))
            .signWith(SECRET_KEY)  // 생성된 강력한 키로 서명
            .compact();
    }

    public String generateRefreshToken(String userId) {
        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRE_TIME))
            .signWith(SECRET_KEY)  // 생성된 강력한 키로 서명
            .compact();
    }
}