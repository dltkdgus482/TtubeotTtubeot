package com.user.userttubeot.user.application;

import java.time.Duration;
import java.time.Instant;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsVerificationService {

    private static final Duration VERIFICATION_CODE_EXPIRE_DURATION = Duration.ofMinutes(5);
    private final StringRedisTemplate redisTemplate;

    public String generateAndSaveVerificationCode(String phoneNumber) {
        String verificationCode = generateVerificationCode();
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        String key = "SMS_CODE_" + phoneNumber;

        // Redis에 인증 번호와 타임스탬프 저장
        hashOperations.put(key, "code", verificationCode);
        hashOperations.put(key, "timestamp",
            String.valueOf(Instant.now().getEpochSecond())); // 현재 시간 초 단위 저장

        // 만료 시간 설정
        redisTemplate.expire(key, VERIFICATION_CODE_EXPIRE_DURATION);

        log.info("인증 번호 생성 및 Redis에 저장 완료. 전화번호: {}, 코드: {}", phoneNumber, verificationCode);
        return verificationCode;
    }

    public boolean verifyCode(String phoneNumber, String verificationCode) {
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        String key = "SMS_CODE_" + phoneNumber;

        String storedCode = hashOperations.get(key, "code");
        String storedTimestamp = hashOperations.get(key, "timestamp");

        if (storedCode == null || storedTimestamp == null) {
            log.warn("인증 시간이 만료되었습니다. 전화번호: {}", phoneNumber);
            return false;
        }

        // 타임스탬프 확인 (5분 이상 경과 시 만료로 처리 가능)
        long currentTimestamp = Instant.now().getEpochSecond();
        long savedTimestamp = Long.parseLong(storedTimestamp);
        if (currentTimestamp - savedTimestamp > VERIFICATION_CODE_EXPIRE_DURATION.getSeconds()) {
            log.warn("인증 시간이 초과되었습니다. 전화번호: {}", phoneNumber);
            redisTemplate.delete(key);
            return false;
        }

        boolean isMatch = storedCode.equals(verificationCode);
        if (isMatch) {
            redisTemplate.delete(key);
            log.info("인증 성공 및 Redis에서 코드 삭제 완료. 전화번호: {}", phoneNumber);
        } else {
            log.warn("인증 번호가 일치하지 않습니다. 입력된 코드: {}, 저장된 코드: {}", verificationCode, storedCode);
        }
        return isMatch;
    }

    // 인증 번호 6자리 생성
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
