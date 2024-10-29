package com.user.userttubeot.user.domain.dto;

import lombok.Data;

@Data
public class TokenDto {

    private String accessToken;
    private String refreshToken;

}
