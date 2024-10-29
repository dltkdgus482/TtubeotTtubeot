package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTtubeotOwnershipRepository extends JpaRepository<UserTtuBeotOwnership, Long> {

    // userTtubeotOwnershipId와 상태를 기준으로 정상 상태의 뚜벗 조회
    Optional<UserTtuBeotOwnership> findByUserTtubeotOwnershipIdAndTtubeotStatus(
        Integer userTtubeotOwnershipId, Integer ttubeotStatus);

    Optional<UserTtuBeotOwnership> findByUser_UserIdAndTtubeotStatus(Integer userId,
        Integer ttubeotStatus);
}
