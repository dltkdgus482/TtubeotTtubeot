package com.user.userttubeot.ttubeot.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "ttubeot_log")
public class TtubeotLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ttubeotLogId;

    @Column(name = "ttubeot_log_type")
    private Integer ttubeotLogType = 0; // DEFAULT

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_ttubeot_ownership_id", nullable = false)
    private UserTtuBeotOwnership userTtuBeotOwnership;

}
