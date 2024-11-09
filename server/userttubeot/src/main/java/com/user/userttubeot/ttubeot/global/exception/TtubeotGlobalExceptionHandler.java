package com.user.userttubeot.ttubeot.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TtubeotGlobalExceptionHandler {

    // 보유하고 있지 않은 뚜벗 조회 예외처리
    @ExceptionHandler(TtubeotNotFoundException.class)
    public ResponseEntity<String> handleTtubeotNotFoundException(TtubeotNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ex.getMessage());
    }
}
