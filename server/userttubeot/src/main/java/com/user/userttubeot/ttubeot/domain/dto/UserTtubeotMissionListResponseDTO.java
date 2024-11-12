package com.user.userttubeot.ttubeot.domain.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTtubeotMissionListResponseDTO {

    private List<UserTtubeotMissionResponseDTO> inProgressMissions; // 진행 중 미션 리스트
    private List<UserTtubeotMissionResponseDTO> completedMissions; // 완료된 미션 리스트

}
