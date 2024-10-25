package com.user.userttubeot.user.domain.dto;

import lombok.Data;

@Data
public class SmsConfirmRequest {

    private String phoneNumber;
    private String verificationCode;
}