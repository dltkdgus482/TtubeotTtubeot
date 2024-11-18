package com.user.userttubeot.ttubeot.domain.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTtubeotInterestResponseDTO {

    private Integer ttubeotInterest;
    private Integer currentTtubeotStatus; // 뚜벗의 현재 상태
    private Integer lastActionType; // 뚜벗이 마지막으로 한 행동 타입
    private LocalDateTime lastActionTime; // 뚜벗이 마지막으로 해당 행동 한 시점

}
