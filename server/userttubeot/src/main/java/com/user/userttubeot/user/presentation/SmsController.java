package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.SmsService;
import com.user.userttubeot.user.domain.dto.SmsConfirmRequest;
import java.time.Duration;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/sms-verification")
public class SmsController {

    private static final Duration VERIFICATION_CODE_EXPIRE_DURATION = Duration.ofMinutes(5);

    private final StringRedisTemplate redisTemplate;
    private final SmsService smsService;

    @PostMapping("/request")
    public String sendSms(@RequestBody String phoneNumber) {
        log.info("SMS 인증 요청이 들어왔습니다. 전화번호: {}", phoneNumber);

        // 인증 번호 생성
        String verificationCode = generateVerificationCode();
        log.info("생성된 인증 번호: {}", verificationCode);

        // Redis에 인증 번호와 타임스탬프 저장
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        valueOperations.set("SMS_CODE_" + phoneNumber, verificationCode,
            VERIFICATION_CODE_EXPIRE_DURATION);
        log.info("Redis에 인증 번호 저장 완료. 키: SMS_CODE_{}", phoneNumber);

        // SMS 전송
        try {
            String responseMessage = smsService.sendMessage(phoneNumber, verificationCode);
            log.info("CoolSMS 응답: {}", responseMessage);
        } catch (Exception e) {
            log.error("SMS 전송 실패", e);
            return "SMS 전송에 실패했습니다.";
        }
        log.info("SMS 전송 성공");
        return "인증 번호가 전송되었습니다.";
    }

    @PostMapping("/confirm")
    public String confirmSms(@RequestBody SmsConfirmRequest request) {
        log.info("SMS 인증 확인 요청이 들어왔습니다. 전화번호: {}", request.getPhoneNumber());

        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String storedCode = valueOperations.get("SMS_CODE_" + request.getPhoneNumber());

        if (storedCode == null) {
            log.warn("인증 시간이 만료되었습니다. 전화번호: {}", request.getPhoneNumber());
            return "인증 시간이 만료되었습니다.";
        }

        if (!storedCode.equals(request.getVerificationCode())) {
            log.warn("인증 번호가 일치하지 않습니다. 입력된 코드: {}, 저장된 코드: {}", request.getVerificationCode(),
                storedCode);
            return "인증 번호가 일치하지 않습니다.";
        }

        // 인증 성공 시 Redis에서 코드 삭제
        redisTemplate.delete("SMS_CODE_" + request.getPhoneNumber());
        log.info("인증 성공 및 Redis에서 코드 삭제 완료. 전화번호: {}", request.getPhoneNumber());

        return "인증에 성공했습니다.";
    }

    // 인증 번호 6자리 생성
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
