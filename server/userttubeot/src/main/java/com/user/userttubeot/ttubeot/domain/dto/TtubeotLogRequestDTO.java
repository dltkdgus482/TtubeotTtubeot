package com.user.userttubeot.ttubeot.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TtubeotLogRequestDTO {

    private Long userTtubeotOwnershipId; // 유저의 뚜벗 아이디
    private Integer ttubeotLogType; // 로그타입

}
