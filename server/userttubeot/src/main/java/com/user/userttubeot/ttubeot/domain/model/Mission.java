package com.user.userttubeot.ttubeot.domain.model;

import com.user.userttubeot.ttubeot.domain.dto.backend.MissionRegistToDbDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "mission")
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer missionId;

    @Column(name = "mission_name", nullable = false, length = 32)
    private String missionName;

    @Column(name = "mission_explanation", length = 128)
    private String missionExplanation;

    @Column(name = "mission_target_count", nullable = false)
    private Integer missionTargetCount;

    @Column(name = "mission_type", nullable = false)
    private Integer missionType; // 일간 - 0, 주간 - 1 (default: 0)

    @Column(name = "mission_theme", nullable = false)
    private Integer missionTheme; // 상호작용 - 0, 모험 - 1, 사회성 - 2

    @Column(name = "mission_reward", nullable = false)
    private Integer missionReward;

    @OneToMany(mappedBy = "mission", fetch = FetchType.LAZY)
    private List<UserTtubeotMission> userTtubeotMissions = new ArrayList<>();

    // DTO to Entity
    public static Mission fromDTO(MissionRegistToDbDTO dto) {
        return Mission.builder()
            .missionName(dto.getMissionName())
            .missionExplanation(dto.getMissionExplanation())
            .missionTargetCount(dto.getMissionTargetCount())
            .missionType(dto.getMissionType())
            .missionTheme(dto.getMissionTheme())
            .missionReward(dto.getMissionReward())
            .build();
    }
}
