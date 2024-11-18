package com.user.userttubeot.user.domain.exception;

/**
 * 특정 사용자를 찾을 수 없을 때 발생하는 예외 클래스.
 */
public class UserNotFoundException extends RuntimeException {

    // 기본 생성자
    public UserNotFoundException() {
        super("사용자를 찾을 수 없습니다.");
    }

    // 예외 메시지를 사용자 지정하여 생성할 수 있는 생성자
    public UserNotFoundException(String message) {
        super(message);
    }

    // 원인이 되는 예외를 포함한 생성자 (예: 데이터베이스 예외 등)
    public UserNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
