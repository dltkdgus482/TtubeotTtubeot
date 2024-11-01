package com.user.userttubeot.ttubeot.domain.dto.backend;

import lombok.Data;

@Data
public class MissionRegistToDbDTO {

    private String missionName; // 미션 이름
    private String missionExplanation; // 미션 설명
    private Integer missioNTargetCount; // 미션 달성 목표량
    private Integer missionTheme; // 상호작용 - 0, 모험 - 1, 사회성 - 2


}
