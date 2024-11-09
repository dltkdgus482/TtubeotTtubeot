package com.user.userttubeot.ttubeot.domain.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class RecentBreakupTtubeotResponseDTO {

    private Integer ttubeotId;// 뚜벗의 아이디
    private Long userTtubeotOwnershipId; // 사용자 뚜벗의 아이디
    private Integer graduationStatus; // 어떻게 헤어졌는지
    private LocalDateTime breakUp; // 언제 헤어졌는지

}
