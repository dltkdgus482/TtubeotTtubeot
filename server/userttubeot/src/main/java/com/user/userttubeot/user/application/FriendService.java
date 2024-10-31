package com.user.userttubeot.user.application;

import com.user.userttubeot.user.domain.repository.FriendRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class FriendService {

    private final FriendRepository friendRepository;

    public void sendFriendRequest(Integer userId, Integer friendRequestId) {
    }
}
