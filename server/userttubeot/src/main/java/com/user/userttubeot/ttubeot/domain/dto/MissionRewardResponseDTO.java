package com.user.userttubeot.ttubeot.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MissionRewardResponseDTO {

    private int rewardCoins;
    private String message; // 보상 결과 메시지

}
