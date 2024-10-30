package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.model.TtubeotLog;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TtubeotLogRepository extends JpaRepository<TtubeotLog, Long> {

    // 특정 유저의 ID와 createdAt 날짜 이후의 로그 조회
    List<TtubeotLog> findByUserTtuBeotOwnership_User_UserIdAndCreatedAtAfter(Integer userId, LocalDateTime createdAt);

    // 유저의 ID와 날짜 범위 사이의 로그 조회
    List<TtubeotLog> findByUserTtuBeotOwnership_User_UserIdAndCreatedAtBetween(Integer userId, LocalDateTime start, LocalDateTime end);
}
