package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTtubeotOwnershipRepository extends JpaRepository<UserTtuBeotOwnership, Long> {

}
