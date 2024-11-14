package com.user.userttubeot.ttubeot.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTtubeotGetIdRespDto {

    private Integer ttubeotId; // 뚜벗의 아이디
    private String message; // 응답 메시지

}
