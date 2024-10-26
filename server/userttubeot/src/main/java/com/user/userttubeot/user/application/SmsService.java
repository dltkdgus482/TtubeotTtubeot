package com.user.userttubeot.user.application;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmsService {

    @Value("${coolsms.api-key}")
    private String apiKey;

    @Value("${coolsms.api-secret}")
    private String apiSecret;

    private static final String SMS_API_URL = "https://api.coolsms.co.kr/messages/v4/send";

    public String sendMessage(String to, String code) {
        try {
            String authorization = generateAuthorizationHeader();

            HttpURLConnection connection = (HttpURLConnection) new URL(
                SMS_API_URL).openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Authorization", authorization);
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            connection.setDoOutput(true);

            JSONObject message = new JSONObject();
            message.put("from", "01084964116");
            message.put("to", to);
            message.put("type", "SMS");
            message.put("text", "인증번호는 " + code + "입니다.");

            JSONObject body = new JSONObject();
            body.put("message", message);

            log.debug("SMS 요청 본문: {}", body);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                log.info("인증번호 전송 성공: 수신자={}, 코드={}", to, code);
                return "인증번호가 전송되었습니다.";
            } else {
                String errorMessage = connection.getResponseMessage();
                log.error("SMS 전송 실패: 응답 코드={}, 응답 메시지={}", responseCode, errorMessage);
                return "SMS 전송 실패: " + errorMessage;
            }

        } catch (Exception e) {
            log.error("SMS 전송 중 오류 발생", e);
            return "SMS 전송 중 오류가 발생했습니다.";
        }
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
        String signature = Base64.getEncoder().encodeToString(hashBytes);

        String authorizationHeader =
            "HMAC-SHA256 apiKey=" + apiKey + ", date=" + date + ", salt=" + salt
                + ", signature=" + signature;
        log.debug("Authorization Header 생성: {}", authorizationHeader);

        return authorizationHeader;
    }
}
