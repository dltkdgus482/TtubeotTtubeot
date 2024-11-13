package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.model.TtubeotLog;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TtubeotLogRepository extends JpaRepository<TtubeotLog, Long> {

    // 특정 유저의 ID와 createdAt 날짜 이후의 로그 조회
    List<TtubeotLog> findByUserTtuBeotOwnership_User_UserIdAndCreatedAtAfter(Integer userId,
        LocalDateTime createdAt);

    // 유저의 ID와 날짜 범위 사이의 로그 조회
    List<TtubeotLog> findByUserTtuBeotOwnership_User_UserIdAndCreatedAtBetween(Integer userId,
        LocalDateTime start, LocalDateTime end);

    // 특정 userTtubeotOwnershipId와 LogType이 2인 로그의 갯수를 반환
    @Query("SELECT COUNT(t) FROM TtubeotLog t WHERE t.userTtuBeotOwnership.userTtubeotOwnershipId = :ownershipId AND t.ttubeotLogType = 2")
    int countLogsByOwnershipIdAndLogType(@Param("ownershipId") Long ownershipId);

    // 최근 10개 로그 조회
    @Query("SELECT t FROM TtubeotLog t WHERE t.userTtuBeotOwnership = :ownership ORDER BY t.createdAt DESC")
    List<TtubeotLog> findRecentLogsByOwnership(@Param("ownership") UserTtuBeotOwnership ownership,
        Pageable pageable);
}
