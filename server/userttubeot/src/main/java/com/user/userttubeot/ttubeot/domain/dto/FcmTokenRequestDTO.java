package com.user.userttubeot.ttubeot.domain.dto;

import lombok.Data;

@Data
public class FcmTokenRequestDTO {

    private Integer userId;
    private String fcmToken;

}
