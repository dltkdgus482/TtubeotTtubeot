package com.user.userttubeot.user.application;

import com.user.userttubeot.ttubeot.application.service.TtubeotService;
import com.user.userttubeot.user.domain.dto.FriendInfoDto;
import com.user.userttubeot.user.domain.entity.Friend;
import com.user.userttubeot.user.domain.entity.FriendId;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.exception.CoinAlreadySentException;
import com.user.userttubeot.user.domain.exception.FriendNotFoundException;
import com.user.userttubeot.user.domain.repository.FriendRepository;
import com.user.userttubeot.user.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 친구 요청 및 정보 조회 비즈니스 로직 담당 서비스.
 */
@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class FriendService {

    private final Integer SEND_COIN_AMOUNT = 100;

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final TtubeotService ttubeotService;
    private final UserService userService;

    /**
     * 친구 요청을 보내는 메서드. 양방향 친구 관계를 추가.
     */
    public void sendFriendRequest(Integer userId, Integer friendId) {
        log.info("친구 요청 프로세스 시작 - 사용자 ID: {}, 요청 대상 ID: {}", userId, friendId);

        if (areFriends(userId, friendId)) {
            log.warn("이미 친구 관계 - 사용자 ID: {}, 요청 대상 ID: {}", userId, friendId);
            throw new IllegalArgumentException("이미 친구 관계입니다.");
        }

        saveFriendRelationship(userId, friendId);
        saveFriendRelationship(friendId, userId);
        log.info("양방향 친구 관계 저장 완료 - 사용자 ID: {}, 친구 ID: {}", userId, friendId);
    }

    /**
     * 사용자 ID로 친구 정보를 조회하여 DTO 리스트로 반환.
     */
    public List<FriendInfoDto> getFriendInfoList(Integer userId) {
        log.info("친구 정보 리스트 조회 시작 - 사용자 ID: {}", userId);

        List<Friend> friendList = friendRepository.findByIdUserId(userId);
        List<FriendInfoDto> friendInfoDtoList = friendList.stream()
            .map(this::mapToFriendInfoDto)
            .toList();

        log.info("친구 정보 리스트 조회 완료 - 사용자 ID: {}, 친구 수: {}", userId, friendInfoDtoList.size());
        return friendInfoDtoList;
    }

    public void sendCoin(Integer userId, Integer friendUserId) {
        // 친구 ID로 친구 관계 확인
        FriendId friendId = new FriendId(userId, friendUserId);
        Friend friend = friendRepository.findById(friendId).orElseThrow(() ->
            new FriendNotFoundException(
                "사용자 ID " + userId + "와 친구 ID " + friendUserId + "는 친구 관계가 아닙니다.")
        );

        User friendUser = userService.findUserById(friendUserId);

        // 오늘 날짜를 구합니다.
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastSend = friend.getLastSend();

        // 마지막 전송 날짜가 오늘인지 확인
        if (lastSend != null && lastSend.toLocalDate().isEqual(now.toLocalDate())) {
            throw new CoinAlreadySentException("사용자 ID " + userId + "는 오늘 이미 코인을 전송했습니다.");
        }

        // 마지막 전송 시간 갱신
        friend.send();
        friendUser.addCoins(SEND_COIN_AMOUNT);

        // 변경된 Friend 엔티티 저장
        friendRepository.save(friend);
        userRepository.save(friendUser);
    }


    /**
     * 두 사용자가 친구 관계인지 확인.
     */
    public boolean areFriends(Integer userId, Integer friendUserId) {
        FriendId friendId = new FriendId(userId, friendUserId);
        boolean exists = friendRepository.existsById(friendId);
        log.debug("친구 관계 확인 - 사용자 ID: {}, 친구 ID: {}, 관계 여부: {}", userId, friendUserId, exists);

        if (!exists) {
            throw new FriendNotFoundException(
                "사용자 ID " + userId + "와 친구 ID " + friendUserId + "는 친구 관계가 아닙니다.");
        }

        return true;
    }

    /**
     * 단방향 친구 관계를 저장하는 헬퍼 메서드.
     */
    private void saveFriendRelationship(Integer userId, Integer friendId) {
        FriendId friendIdEntity = new FriendId(userId, friendId);
        Friend friend = Friend.builder()
            .id(friendIdEntity)
            .build();
        friendRepository.save(friend);
        log.debug("친구 관계 저장 - 사용자 ID: {}, 친구 ID: {}", userId, friendId);
    }

    /**
     * Friend 엔티티를 FriendInfoDto로 매핑하는 헬퍼 메서드.
     */
    private FriendInfoDto mapToFriendInfoDto(Friend friend) {
        Integer friendId = friend.getId().getFriendId();
        User user = userService.findUserById(friendId);

        return new FriendInfoDto(
            friendId,
            user.getUserName(),
            user.getUserGoal(),
            ttubeotService.getDdubeotInfo(friendId)
        );
    }
}
