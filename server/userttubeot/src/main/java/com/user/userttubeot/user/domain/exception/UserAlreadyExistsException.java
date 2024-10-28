package com.user.userttubeot.user.domain.exception;

/**
 * 이미 존재하는 사용자에 대한 예외 클래스. RuntimeException을 상속하여 사용자 정의 예외를 생성합니다.
 */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
