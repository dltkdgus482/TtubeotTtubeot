package com.user.userttubeot.user.infrastructure.security;

import com.user.userttubeot.user.application.RedisService;
import io.jsonwebtoken.Jwts;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    private final SecretKey secretKey;
    private final RedisService redisService;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret, RedisService redisService) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
            Jwts.SIG.HS256.key().build().getAlgorithm());
        this.redisService = redisService; // 주입된 인스턴스 사용
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
        String refreshToken = Jwts.builder()
            .claim("userPhone", userPhone)
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expiredMs))
            .signWith(secretKey)
            .compact();

        String key = "refresh_" + userPhone;

        if (redisService.getValue(key) != null) {
            redisService.deleteValue(key);
        }
        // Redis에 리프레시 토큰 저장 (Duration으로 TTL 설정)
        redisService.setValues(key, refreshToken, Duration.ofMillis(expiredMs));

        return refreshToken;
    }

}
