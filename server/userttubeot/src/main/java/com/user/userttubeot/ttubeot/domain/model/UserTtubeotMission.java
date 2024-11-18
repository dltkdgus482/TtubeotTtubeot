package com.user.userttubeot.ttubeot.domain.model;

import com.user.userttubeot.ttubeot.domain.enums.MissionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
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
@Table(name = "user_ttubeot_mission")
public class UserTtubeotMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userTtubeotMissionId;

    @Column(name = "user_ttubeot_mission_action_count", nullable = false)
    private Integer userTtubeotMissionActionCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MissionStatus missionStatus;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "break_up")
    private LocalDateTime breakUp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_id", nullable = false)
    private Mission mission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_ttubeot_ownership_id", nullable = false)
    private UserTtuBeotOwnership userTtuBeotOwnership;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.missionStatus == null) {
            this.missionStatus = MissionStatus.IN_PROGRESS;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 행동 수 누적 메서드
    public void accumulateActionCount(int steps) {
        this.userTtubeotMissionActionCount += steps;
    }
    
    // 미션 완료 처리 메서드
    public void completeMission(LocalDateTime breakUp) {
        this.missionStatus = MissionStatus.COMPLETED;
        this.userTtubeotMissionActionCount = mission.getMissionTargetCount(); // 최대치로 설정
        this.breakUp = breakUp;
    }

    public void updateUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}
