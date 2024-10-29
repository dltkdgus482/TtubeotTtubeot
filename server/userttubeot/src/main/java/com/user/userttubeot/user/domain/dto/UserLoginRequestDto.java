package com.user.userttubeot.user.domain.dto;

import lombok.Data;

@Data
public class UserLoginRequestDto {

    private String userPhone;
    private String userPassword;
}
