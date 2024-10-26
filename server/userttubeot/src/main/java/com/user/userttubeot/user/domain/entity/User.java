package com.user.userttubeot.user.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "User")
@Getter
@NoArgsConstructor // 기본 생성자 생성
@AllArgsConstructor // 모든 필드를 포함하는 생성자 생성
@Builder // 빌더 패턴 사용 가능
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "user_name", nullable = false, length = 8)
    private String userName;

    @Column(name = "user_phone", nullable = false, length = 11)
    private String userPhone;

    @Column(name = "user_password", nullable = false, length = 64)
    private String userPassword;

    @Column(name = "user_password_salt", nullable = false, length = 10)
    private String userPasswordSalt;

    @Column(name = "user_location_agreement", nullable = false)
    private Boolean userLocationAgreement = false;

    @Column(name = "user_type", nullable = false)
    private Byte userType;

    @Column(name = "user_status", nullable = false)
    private Byte userStatus = 1;

    @Column(name = "user_goal")
    private Integer userGoal;

    @Column(name = "user_coin", nullable = false)
    private Integer userCoin = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "user_parent")
    private Integer userParent;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.userCoin == null) {
            this.userCoin = 0;
        }
        if (this.userStatus == null) {
            this.userStatus = 1;
        }
        if (this.userParent == null) {
            this.userParent = 0;
        }
    }

    // Optional: updated_at 필드를 자동으로 현재 시간으로 갱신하기 위한 메소드
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}