package com.user.userttubeot.user.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserChangePasswordRequestDto {

    private String phone;
    private String password;

}
