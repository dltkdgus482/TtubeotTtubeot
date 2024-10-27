package com.user.userttubeot.user.presentation;

import com.user.userttubeot.user.application.SmsService;
import com.user.userttubeot.user.application.SmsVerificationService;
import com.user.userttubeot.user.domain.dto.SmsConfirmRequestDto;
import com.user.userttubeot.user.domain.dto.SmsRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user/sms-verification")
public class SmsController {

    private final SmsService smsService;
    private final SmsVerificationService smsVerificationService;

    @PostMapping("/request")
    public String sendSms(@RequestBody SmsRequestDto dto) {
        log.info("SMS 인증 요청이 들어왔습니다. 전화번호: {}", dto.getPhone());

        // 인증 번호 생성 및 Redis에 저장
        String verificationCode = smsVerificationService.generateAndSaveVerificationCode(
            dto.getPhone());

        // SMS 전송
        try {
            String responseMessage = smsService.sendMessage(dto.getPhone(), verificationCode);
            log.info("CoolSMS 응답: {}", responseMessage);
        } catch (Exception e) {
            log.error("SMS 전송 실패", e);
            return "SMS 전송에 실패했습니다.";
        }
        return "인증 번호가 전송되었습니다.";
    }

    @PostMapping("/confirm")
    public String confirmSms(@RequestBody SmsConfirmRequestDto request) {
        log.info("SMS 인증 확인 요청이 들어왔습니다. 전화번호: {}", request.getPhone());

        boolean isVerified = smsVerificationService.verifyCode(request.getPhone(),
            request.getCode());
        if (isVerified) {
            return "인증에 성공했습니다.";
        } else {
            return "인증 번호가 일치하지 않거나 시간이 만료되었습니다.";
        }
    }
}
