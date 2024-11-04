package com.user.userttubeot.ttubeot.domain.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTtubeotMissionListResponseDTO {

    private List<UserTtubeotMissionResponseDTO> dailyMissions;

}
