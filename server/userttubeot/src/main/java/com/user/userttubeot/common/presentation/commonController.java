package com.user.userttubeot.common.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class commonController {

    @GetMapping("/healthz")
    public ResponseEntity<?> healthCheck() {
        try {
            // 무슨 일이 있더라도 무조건 200 OK를 반환합니다.
            return ResponseEntity.ok("서비스는 건강합니다 !");
        } catch (Exception e) {
            // 예외가 발생해도 항상 200 OK 반환
            return ResponseEntity.ok("서비스는 일단 건강합니다!");
        }
    }

}
