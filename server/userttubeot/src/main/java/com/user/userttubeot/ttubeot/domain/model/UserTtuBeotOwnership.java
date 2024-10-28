package com.user.userttubeot.ttubeot.domain.model;

import com.user.userttubeot.user.domain.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "user_ttubeot_ownership")
public class UserTtuBeotOwnership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userTtubeotOwnershipId;

    @Column(name = "ttubeot_name")
    private String ttubeotame;

    @Column(name = "ttubeot_status")
    private Integer ttubeotStatus = 0; // DEAULT

    @Column(name = "ttubeot_score")
    private Integer ttubeotScore = 0; // default

    @Column(name = "break_up")
    private LocalDateTime breakUp;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ttubeot_id", nullable = false)
    private Ttubeot ttubeot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
