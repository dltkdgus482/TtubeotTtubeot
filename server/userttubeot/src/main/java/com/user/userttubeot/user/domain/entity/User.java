package com.user.userttubeot.user.domain.entity;

import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "User")
@Getter
@NoArgsConstructor // 기본 생성자 생성
@AllArgsConstructor // 모든 필드를 포함하는 생성자 생성
@Builder(toBuilder = true) // 빌더 패턴 사용 가능
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

    @Column(name = "fcm_token")
    private String fcmToken;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "user_parent")
    private Integer userParent;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserTtuBeotOwnership> userTtuBeotOwnerships = new ArrayList<>();

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

    public void addCoins(Integer coinsToAdd) {
        if (coinsToAdd == null || coinsToAdd < 0) {
            throw new IllegalArgumentException("추가할 코인은 0 이상이어야 합니다.");
        }
        this.userCoin += coinsToAdd;
    }


}