package com.user.userttubeot.user.domain.repository;

import com.user.userttubeot.user.domain.entity.User;
import jakarta.transaction.Transactional;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUserPhone(String userPhone);

    boolean existsByUserPhone(String userPhone);

    boolean existsByUserName(String userName);

    Optional<User> findByUserId(Integer userId);

    // fcmToken 업데이트
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.fcmToken = :fcmToken WHERE u.userId = :userId")
    int updateFcmTokenByUserId(@Param("userId") Integer userId, @Param("fcmToken") String fcmToken);

}
