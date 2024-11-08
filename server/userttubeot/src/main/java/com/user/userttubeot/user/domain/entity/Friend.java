package com.user.userttubeot.user.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
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

    @ManyToOne
    @MapsId("userId") // 복합 키의 userId에 매핑
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @MapsId("friendId") // 복합 키의 friendId에 매핑
    @JoinColumn(name = "friend_id", insertable = false, updatable = false)
    private User friend;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_greeting", nullable = false)
    private LocalDateTime lastGreeting;

    @Column(name = "last_send")
    private LocalDateTime lastSend;

    @PrePersist
    public void prePersist() {
        this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
        this.lastGreeting = this.lastGreeting == null ? LocalDateTime.now() : this.lastGreeting;
    }

    public void meet() {
        this.lastGreeting = LocalDateTime.now();
    }

    public void send() {
        this.lastSend = LocalDateTime.now();
    }
}
