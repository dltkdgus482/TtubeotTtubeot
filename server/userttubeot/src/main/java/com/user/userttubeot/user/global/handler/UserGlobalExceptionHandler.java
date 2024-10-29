package com.user.userttubeot.user.global.handler;

import com.user.userttubeot.user.domain.exception.ResponseMessage;
import com.user.userttubeot.user.domain.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class UserGlobalExceptionHandler {

    // 사용자 정보를 찾을 수 없는 경우
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleUserNotFoundException(UserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ResponseMessage("사용자를 찾을 수 없습니다."));
    }

    // 인증되지 않은 접근 (예: 인증 정보가 없을 때)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ResponseMessage> handleAuthenticationException(
        AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ResponseMessage("인증 정보가 유효하지 않습니다."));
    }

    // 모든 기타 예외 처리 (500 Internal Server Error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseMessage> handleGeneralException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ResponseMessage("서버 오류가 발생했습니다."));
    }
}
