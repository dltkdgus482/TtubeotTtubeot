package com.user.userttubeot.user.infrastructure;

import java.time.Duration;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class SmsVerificationRedisRepository {

    private final StringRedisTemplate redisTemplate;
    private static final Duration VERIFICATION_CODE_EXPIRE_DURATION = Duration.ofMinutes(5);

    /**
     * 인증 코드를 Redis에 저장
     *
     * @param phoneNumber 전화번호
     * @param code 인증 코드
     */
    public void saveVerificationCode(String phoneNumber, String code) {
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        String key = generateKey(phoneNumber);

        hashOperations.put(key, "code", code);
        hashOperations.put(key, "timestamp", String.valueOf(Instant.now().getEpochSecond()));
        redisTemplate.expire(key, VERIFICATION_CODE_EXPIRE_DURATION);
    }

    /**
     * Redis에서 인증 코드 가져오기
     */
    public String getVerificationCode(String phoneNumber) {
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        return hashOperations.get(generateKey(phoneNumber), "code");
    }

    /**
     * Redis에서 타임스탬프 가져오기
     */
    public String getVerificationTimestamp(String phoneNumber) {
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        return hashOperations.get(generateKey(phoneNumber), "timestamp");
    }

    /**
     * Redis에서 인증 코드 삭제
     */
    public void deleteVerificationCode(String phoneNumber) {
        redisTemplate.delete(generateKey(phoneNumber));
    }

    private String generateKey(String phoneNumber) {
        return "SMS_CODE_" + phoneNumber;
    }
}