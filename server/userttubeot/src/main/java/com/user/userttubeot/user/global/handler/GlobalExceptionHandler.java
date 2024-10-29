package com.user.userttubeot.user.global.handler;

import com.user.userttubeot.user.domain.exception.UserAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * 전역 예외 처리를 위한 핸들러 클래스. 모든 컨트롤러에서 발생하는 예외를 중앙에서 처리합니다.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * UserAlreadyExistsException이 발생할 경우 호출되는 메서드.
     *
     * @param ex 발생한 예외 객체
     * @return 클라이언트에 반환할 응답
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }
}
