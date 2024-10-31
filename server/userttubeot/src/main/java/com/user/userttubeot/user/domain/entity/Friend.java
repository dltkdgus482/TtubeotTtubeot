package com.user.userttubeot.user.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "friend")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Friend {

    @EmbeddedId
    private FriendId id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_greeting", nullable = false)
    private LocalDateTime lastGreeting;

    // 엔티티 생성 전에 실행되는 메서드로, 생성 시 기본값 설정
    @PrePersist
    public void prePersist() {
        this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
        this.lastGreeting = this.lastGreeting == null ? LocalDateTime.now() : this.lastGreeting;
    }

    public void meet() {
        this.lastGreeting = this.lastGreeting == null ? LocalDateTime.now() : this.lastGreeting;
    }
}
