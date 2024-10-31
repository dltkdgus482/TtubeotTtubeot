package com.user.userttubeot.user.domain.repository;

import com.user.userttubeot.user.domain.entity.Friend;
import com.user.userttubeot.user.domain.entity.FriendId;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends JpaRepository<Friend, FriendId> {

    boolean existsById(@NotNull FriendId friendId);


}
