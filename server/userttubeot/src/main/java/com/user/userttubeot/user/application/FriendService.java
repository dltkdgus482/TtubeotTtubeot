package com.user.userttubeot.user.application;

import com.user.userttubeot.user.domain.entity.Friend;
import com.user.userttubeot.user.domain.entity.FriendId;
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

    public void sendFriendRequest(Integer userId, Integer friendId) {
        if (areFriends(userId, friendId)) {
            throw new IllegalArgumentException("이미 친구 관계입니다.");
        }

        FriendId friendIdEntity = new FriendId(userId, friendId);
        FriendId reverseFriendId = new FriendId(friendId, userId);

        Friend friend = Friend.builder()
            .id(friendIdEntity)
            .build();
        friendRepository.save(friend);

        // 양방향 친구 관계를 위해 반대 관계도 추가
        Friend reverseFriend = Friend.builder()
            .id(reverseFriendId)
            .build();
        friendRepository.save(reverseFriend);

    }


    public boolean areFriends(Integer userId, Integer friendUserId) {
        FriendId friendId = new FriendId(userId, friendUserId);
        return friendRepository.existsById(friendId);
    }
}
