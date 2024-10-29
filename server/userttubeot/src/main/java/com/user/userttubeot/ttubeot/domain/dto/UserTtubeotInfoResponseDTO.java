package com.user.userttubeot.ttubeot.domain.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserTtubeotInfoResponseDTO {

    private Integer ttubeotType;
    private String ttubeotImage;
    private String ttubeotName;
    private Integer ttubeotScore;
    private LocalDateTime createdAt;

}
