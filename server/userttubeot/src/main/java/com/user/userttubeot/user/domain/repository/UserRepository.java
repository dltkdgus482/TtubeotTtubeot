package com.user.userttubeot.user.domain.repository;

import com.user.userttubeot.user.domain.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUserPhone(String userPhone);
}
