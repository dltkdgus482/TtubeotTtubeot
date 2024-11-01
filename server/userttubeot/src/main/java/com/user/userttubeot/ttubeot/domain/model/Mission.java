package com.user.userttubeot.ttubeot.domain.model;

import com.user.userttubeot.ttubeot.domain.dto.backend.MissionRegistDTO;
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

    @Column(name = "mission_target_count")
    private Integer missionTargetCount;

    @OneToMany(mappedBy = "mission", fetch = FetchType.LAZY)
    private List<UserTtubeotMission> userTtubeotMissions = new ArrayList<>();

    // DTO to Entity
    public static Mission fromDTO(MissionRegistDTO dto) {
        return Mission.builder()
            .missionName(dto.getMissionName())
            .missionExplanation(dto.getMissionExplanation())
            .missionTargetCount(dto.getMissioNTargetCount())
            .build();
    }
}
