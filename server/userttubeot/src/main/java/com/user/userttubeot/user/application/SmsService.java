package com.user.userttubeot.user.application;

import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class SmsService {

    @Value("${coolsms.api-key}")
    private String apiKey;

    @Value("${coolsms.api-secret}")
    private String apiSecret;

    private static final String SMS_API_URL = "https://api.coolsms.co.kr/messages/v4/send";

    private final RestTemplate restTemplate = new RestTemplate(); // RestTemplate 인스턴스 생성

    public String sendMessage(String to, String code) {
        try {
            String authorization = generateAuthorizationHeader();

            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", authorization);

            // JSON 메시지 본문 구성
            JSONObject message = new JSONObject();
            message.put("from", "01084964116");
            message.put("to", to);
            message.put("type", "SMS");
            message.put("text", "인증번호는 " + code + "입니다.");

            JSONObject body = new JSONObject();
            body.put("message", message);

            // 요청 생성
            HttpEntity<String> requestEntity = new HttpEntity<>(body.toString(), headers);

            // API 호출 및 응답 처리
            ResponseEntity<String> response = restTemplate.exchange(
                SMS_API_URL,
                HttpMethod.POST,
                requestEntity,
                String.class
            );

            // 응답 코드에 따라 성공/실패 로그 처리
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("인증번호 전송 성공: 수신자={}, 코드={}", to, code);
                return "인증번호가 전송되었습니다.";
            } else {
                log.error("SMS 전송 실패: 응답 코드={}, 응답 메시지={}", response.getStatusCode(),
                    response.getBody());
                return "SMS 전송 실패: " + response.getBody();
            }

        } catch (Exception e) {
            log.error("SMS 전송 중 오류 발생", e);
            return "SMS 전송 중 오류가 발생했습니다.";
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private String generateAuthorizationHeader() throws Exception {
        String salt = UUID.randomUUID().toString().replace("-", "");
        String date = ZonedDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
        String data = date + salt;

        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(apiSecret.getBytes(StandardCharsets.UTF_8),
            "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // Custom Hex 변환 함수 사용
        String signature = bytesToHex(hashBytes);

        String authorizationHeader = String.format(
            "HMAC-SHA256 apiKey=%s, date=%s, salt=%s, signature=%s",
            apiKey, date, salt, signature
        );
        log.debug("Authorization Header 생성: {}", authorizationHeader);

        return authorizationHeader;
    }
}