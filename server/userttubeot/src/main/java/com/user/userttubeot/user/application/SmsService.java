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
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${coolsms.api-key}")
    private static String API_KEY;
    @Value("${coolsms.api-secret}")
    private static String API_SECRET;
    private static final String SMS_API_URL = "https://api.coolsms.co.kr/messages/v4/send";

    public String sendMessage(String to, String code) throws Exception {
        String authorization = generateAuthorizationHeader();

        // HTTP POST 요청 설정
        HttpURLConnection connection = (HttpURLConnection) new URL(SMS_API_URL).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", authorization);
        connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        connection.setDoOutput(true);

        // JSON 메시지 작성
        JSONObject message = new JSONObject();
        message.put("from", "01084964116");  // 발신 번호
        message.put("to", to);
        message.put("type", "SMS");
        message.put("text", "인증번호는 " + code + "입니다.");

        JSONObject body = new JSONObject();
        body.put("message", message);

        // JSON 바디 전송
        try (OutputStream os = connection.getOutputStream()) {
            os.write(body.toString().getBytes(StandardCharsets.UTF_8));
        }

        // 응답 처리
        if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
            return "인증번호가 전송되었습니다.";
        } else {
            return "SMS 전송 실패: " + connection.getResponseMessage();
        }
    }

    private String generateAuthorizationHeader() throws Exception {
        String salt = UUID.randomUUID().toString().replace("-", "");
        String date = ZonedDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
        String data = date + salt;

        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(
            SmsService.API_SECRET.getBytes(StandardCharsets.UTF_8),
            "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        String signature = Base64.getEncoder().encodeToString(hashBytes);

        return "HMAC-SHA256 apiKey=" + SmsService.API_KEY + ", date=" + date + ", salt=" + salt
            + ", signature="
            + signature;
    }
}
