package com.user.userttubeot.user.domain.dto;

import lombok.Data;

@Data
public class SmsConfirmRequestDto {

    private String phone;
    private String code;
}