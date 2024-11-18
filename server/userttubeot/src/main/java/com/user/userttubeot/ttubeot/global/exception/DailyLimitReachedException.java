package com.user.userttubeot.ttubeot.global.exception;

public class DailyLimitReachedException extends RuntimeException {
    public DailyLimitReachedException(String message) {
        super(message);
    }
}
