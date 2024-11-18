package com.user.userttubeot.ttubeot.domain.dto;

import lombok.Data;

@Data
public class TtubeotDrawRequestDTO {

    private Integer type; // 랜덤 - 1, 확정 - 2, 등급 - 3
    private Integer ttubeotId; // 확정(null)
    private Integer grade; // 등급(null)
    private Integer price; // 가격(not null)

}
