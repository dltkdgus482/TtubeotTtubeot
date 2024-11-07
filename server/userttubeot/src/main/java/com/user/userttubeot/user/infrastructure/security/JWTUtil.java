package com.user.userttubeot.user.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    private final SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
            SignatureAlgorithm.HS256.getJcaName());
    }

    public String getUserPhone(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token)
            .getBody();
        return claims.get("userPhone", String.class);
    }

    public Integer getUserId(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token)
            .getBody();
        return claims.get("userId", Integer.class);
    }

    public boolean isExpired(String token) {
        Date expiration = Jwts.parserBuilder().setSigningKey(secretKey).build()
            .parseClaimsJws(token).getBody().getExpiration();
        return expiration.before(new Date());
    }

    public String createAccessToken(Integer userId, String userPhone) {
//        long expiredMs = 1000 * 60 * 10; // 10분 - 배포 환경
        long expiredMs = 1000 * 60 * 60 * 24; // 1일 - 테스트 환경
        
        return Jwts.builder()
            .claim("userId", userId)
            .claim("userPhone", userPhone)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
            .signWith(secretKey)
            .compact();
    }

    public String createRefreshToken(Integer userId, String userPhone) {
        long expiredMs = 1000 * 60 * 60 * 24; // 1일
        return Jwts.builder()
            .claim("userId", userId)
            .claim("userPhone", userPhone)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
            .signWith(secretKey)
            .compact();
    }

}
