package com.user.userttubeot.ttubeot.domain.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class TtubeotLogResponseDTO {

    private Integer ttubeotLogType; // 뚜벗의 행동 타입
    private LocalDateTime createdAt; // 뚜벗의 행동 일시

}
