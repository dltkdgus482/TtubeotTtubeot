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

    // 인증 코드 유효 시간 (5분)
    private static final Duration VERIFICATION_CODE_EXPIRE_DURATION = Duration.ofMinutes(5);
    private final StringRedisTemplate redisTemplate;

    /**
     * 인증 코드를 생성하고 Redis에 저장하는 메서드
     *
     * @param phoneNumber 사용자의 전화번호
     * @return 생성된 인증 코드
     */
    public String generateAndSaveVerificationCode(String phoneNumber) {
        // 6자리 인증 코드 생성
        String verificationCode = generateVerificationCode();

        // Redis 해시 연산 객체 생성
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        String key = "SMS_CODE_" + phoneNumber;  // 전화번호 기반으로 Redis 키 설정

        // Redis에 인증 번호와 현재 타임스탬프 저장
        hashOperations.put(key, "code", verificationCode);
        hashOperations.put(key, "timestamp",
            String.valueOf(Instant.now().getEpochSecond())); // 타임스탬프 저장

        // 만료 시간 설정
        redisTemplate.expire(key, VERIFICATION_CODE_EXPIRE_DURATION);

        // 로그 기록
        log.info("인증 번호 생성 및 Redis에 저장 완료. 전화번호: {}, 코드: {}", phoneNumber, verificationCode);

        return verificationCode;
    }

    /**
     * 입력된 인증 코드가 유효한지 확인하는 메서드
     *
     * @param phoneNumber      사용자의 전화번호
     * @param verificationCode 입력된 인증 코드
     * @return 인증 성공 여부
     */
    public boolean verifyCode(String phoneNumber, String verificationCode) {
        // Redis 해시 연산 객체 생성
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();
        String key = "SMS_CODE_" + phoneNumber;

        // Redis에서 저장된 인증 코드와 타임스탬프 가져오기
        String storedCode = hashOperations.get(key, "code");
        String storedTimestamp = hashOperations.get(key, "timestamp");

        // 인증 코드 또는 타임스탬프가 없을 경우 인증 시간 초과로 처리
        if (storedCode == null || storedTimestamp == null) {
            log.warn("인증 시간이 만료되었습니다. 전화번호: {}", phoneNumber);
            return false;
        }

        // 현재 시간과 저장된 시간 차이를 계산하여 인증 코드 만료 여부 확인
        long currentTimestamp = Instant.now().getEpochSecond();
        long savedTimestamp = Long.parseLong(storedTimestamp);
        if (currentTimestamp - savedTimestamp > VERIFICATION_CODE_EXPIRE_DURATION.getSeconds()) {
            log.warn("인증 시간이 초과되었습니다. 전화번호: {}", phoneNumber);
            redisTemplate.delete(key); // 만료된 키 삭제
            return false;
        }

        // 입력된 인증 코드와 저장된 인증 코드가 일치하는지 확인
        boolean isMatch = storedCode.equals(verificationCode);
        if (isMatch) {
            log.info("인증 성공. 전화번호: {}", phoneNumber);
        } else {
            log.warn("인증 번호가 일치하지 않습니다. 입력된 코드: {}, 저장된 코드: {}", verificationCode, storedCode);
        }
        return isMatch;
    }

    /**
     * 주어진 전화번호에 대한 인증 여부 확인
     *
     * @param phoneNumber 사용자의 전화번호
     * @return 전화번호 인증 여부
     */
    public boolean isPhoneVerified(String phoneNumber) {
        String key = "SMS_CODE_" + phoneNumber;
        HashOperations<String, String, String> hashOperations = redisTemplate.opsForHash();

        // Redis에 인증 코드가 존재하는지 확인
        String storedCode = hashOperations.get(key, "code");
        boolean isVerified = storedCode != null;

        log.info("전화번호 인증 상태 확인. 전화번호: {}, 인증 상태: {}", phoneNumber, isVerified ? "인증됨" : "인증되지 않음");

        return isVerified;
    }

    /**
     * 주어진 전화번호에 대한 인증 데이터를 Redis에서 삭제하는 메서드
     *
     * @param phoneNumber 사용자의 전화번호
     * @return 삭제 성공 여부
     */
    public boolean deleteVerificationCode(String phoneNumber) {
        String key = "SMS_CODE_" + phoneNumber;  // 전화번호 기반으로 Redis 키 설정

        // Redis에서 해당 키 삭제
        Boolean isDeleted = redisTemplate.delete(key);

        // 삭제 성공 여부 로그 기록
        if (Boolean.TRUE.equals(isDeleted)) {
            log.info("인증 데이터가 삭제되었습니다. 전화번호: {}", phoneNumber);
            return true;
        } else {
            log.warn("인증 데이터 삭제 실패. 전화번호: {}", phoneNumber);
            return false;
        }
    }


    /**
     * 6자리 인증 번호 생성
     *
     * @return 6자리 인증 번호
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);  // 6자리 숫자 생성
        log.debug("랜덤 인증 번호 생성: {}", code);
        return String.valueOf(code);
    }
}
