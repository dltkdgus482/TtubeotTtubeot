package com.user.userttubeot.ttubeot.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserTtubeotMissionResponseDTO {

    private String missionStatus; // 미션의 진행 여부 -> 진행중인가 완료했는가
    private Integer missionTheme; // 미션의 테마(상호작용 - 0, 모험 - 1, 사회성 - 2)
    private Integer missionType; // 미션의 타입(일간 - 0, 주간 - 1)
    private Integer missionTargetCount; // 미션의 목표량(이만큼 달성해야 합니다~)
    private String missionName; // 미션의 이름
    private String missionExplanation; // 미션의 설명
    private Integer missionActionCount; // 행동의 누적 횟수 (내가 얼만큼 했는가)

}
