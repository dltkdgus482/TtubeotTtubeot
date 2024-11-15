package com.user.userttubeot.ttubeot.domain.dto;

import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserTtuBeotOwnershipDTO {

    private Long userTtubeotOwnershipId;
    private String ttubeotName;
    private Integer ttubeotStatus;
    private Integer ttubeotScore;
    private Integer ttubeotInterest;
    private LocalDateTime breakUp;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long ttubeotId; // Ttubeot 엔티티의 ID만 포함
    private String ttubeotType; // Ttubeot 타입(예: 이름 또는 설명)
    private Long userId; // User 엔티티의 ID만 포함
    private String username; // 사용자 이름

    public static UserTtuBeotOwnershipDTO fromEntity(UserTtuBeotOwnership entity) {
        return UserTtuBeotOwnershipDTO.builder()
            .userTtubeotOwnershipId(entity.getUserTtubeotOwnershipId())
            .ttubeotName(entity.getTtubeotName())
            .ttubeotStatus(entity.getTtubeotStatus())
            .ttubeotScore(entity.getTtubeotScore())
            .ttubeotInterest(entity.getTtubeotInterest())
            .breakUp(entity.getBreakUp())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .ttubeotId(entity.getTtubeot().getTtubeotId())
            .ttubeotType(entity.getTtubeot().getTtubeotType()) // 예: 타입, 설명 등
            .userId(entity.getUser().getUserId())
            .username(entity.getUser().getUsername())
            .build();
    }
}
