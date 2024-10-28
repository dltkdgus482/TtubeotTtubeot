package com.user.userttubeot.user.infrastructure.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    private final SecretKey secretKey;

    public JWTUtil(@Value("{spring.jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
            SIG.HS256.key().build().getAlgorithm());
    }

    public String getUserPhone(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token)
            .getPayload().get("userPhone", String.class);
    }

    public boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token)
            .getPayload().getExpiration().before(new Date());
    }

    public String createAccessToken(String userPhone) {
        long expiredMs = 1000 * 60 * 10; // 10분
        return Jwts.builder()
            .claim("userPhone", userPhone)
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expiredMs))
            .signWith(secretKey)
            .compact();
    }

    public String createRefreshToken(String userPhone) {
        long expiredMs = 1000 * 60 * 60 * 24; // 1일
        return Jwts.builder()
            .claim("userPhone", userPhone)
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expiredMs))
            .signWith(secretKey)
            .compact();
    }

}
