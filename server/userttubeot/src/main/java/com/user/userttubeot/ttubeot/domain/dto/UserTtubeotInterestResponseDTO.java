package com.user.userttubeot.ttubeot.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTtubeotInterestResponseDTO {

    private Integer ttubeotInterest;
    private Integer currentTtubeotStatus; // 뚜벗의 현재 상태

}
