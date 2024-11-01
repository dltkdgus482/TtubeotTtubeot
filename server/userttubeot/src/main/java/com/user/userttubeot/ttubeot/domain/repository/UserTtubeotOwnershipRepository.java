package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTtubeotOwnershipRepository extends JpaRepository<UserTtuBeotOwnership, Long> {

    // userTtubeotOwnershipId와 상태를 기준으로 정상 상태의 뚜벗 조회
    Optional<UserTtuBeotOwnership> findByUserTtubeotOwnershipIdAndTtubeotStatus(
        Long userTtubeotOwnershipId, Integer ttubeotStatus);

    // userId와 상태를 기준으로 정상 상태의 뚜벗 조회
    Optional<UserTtuBeotOwnership> findByUser_UserIdAndTtubeotStatus(Integer userId, Integer ttubeotStatus);

    // 특정 userId와 졸업 상태인 ttubeotStatus를 기준으로 졸업된 뚜벗 목록을 가져옴
    List<UserTtuBeotOwnership> findAllByUser_UserIdAndTtubeotStatus(int userId, int ttubeotStatus);


}
