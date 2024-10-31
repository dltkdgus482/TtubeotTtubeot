package com.user.userttubeot.user.domain.repository;

import com.user.userttubeot.user.domain.entity.Friend;
import com.user.userttubeot.user.domain.entity.FriendId;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends JpaRepository<Friend, FriendId> {

    boolean existsById(@NotNull FriendId friendId);

    // FriendId의 userId가 특정 ID와 일치하는 모든 Friend 엔티티를 반환
    List<Friend> findByIdUserId(Integer userId);


}
