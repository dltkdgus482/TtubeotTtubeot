package com.user.userttubeot.user.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenDto {

    private String accessToken;
    private String refreshToken;

}
