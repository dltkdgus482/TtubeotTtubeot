package com.user.userttubeot.user.application;

import com.user.userttubeot.ttubeot.application.service.TtubeotService;
import com.user.userttubeot.user.domain.dto.FriendInfoDto;
import com.user.userttubeot.user.domain.entity.Friend;
import com.user.userttubeot.user.domain.entity.FriendId;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.exception.CoinAlreadySentException;
import com.user.userttubeot.user.domain.exception.FriendNotFoundException;
import com.user.userttubeot.user.domain.exception.ResponseMessage;
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

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final TtubeotService ttubeotService;
    private final UserService userService;

    /**
     * 친구 요청을 처리하는 메서드. 친구 상태에 따라 코인 전송 및 lastGreeting 업데이트.
     */
    public ResponseMessage handleFriendRequest(Integer userId, Integer friendId) {
        log.info("친구 요청 처리 시작 - 사용자 ID: {}, 친구 요청 대상 ID: {}", userId, friendId);

        if (areFriends(userId, friendId)) {
            Friend friend = findFriend(userId, friendId);
            LocalDateTime now = LocalDateTime.now();

            if (friend.getLastGreeting() != null && friend.getLastGreeting().toLocalDate()
                .isEqual(now.toLocalDate())) {
                return new ResponseMessage("이미 친구 관계입니다. 오늘 이미 인사하여 코인이 전송되지 않았습니다.");
            }
            sendCoins(userId, friendId, 100);
            updateLastGreeting(userId, friendId);
            updateLastGreeting(friendId, userId);
            return new ResponseMessage("이미 친구 관계입니다. 마지막 인사 시간이 갱신되었습니다.");
        }

        sendFriendRequest(userId, friendId);
        sendCoins(userId, friendId, 300);
        updateLastGreeting(userId, friendId);
        return new ResponseMessage("친구 요청이 전송되었습니다.");
    }

    /**
     * 친구 요청을 보내는 메서드. 양방향 친구 관계를 추가.
     */
    public void sendFriendRequest(Integer userId, Integer friendId) {
        log.info("친구 요청 프로세스 시작 - 사용자 ID: {}, 요청 대상 ID: {}", userId, friendId);

        if (areFriends(userId, friendId)) {
            log.warn("이미 친구 관계 - 사용자 ID: {}, 요청 대상 ID: {}", userId, friendId);
            throw new IllegalArgumentException("이미 친구 관계입니다.");
        }

        createBidirectionalFriendship(userId, friendId);
        log.info("양방향 친구 관계 저장 완료 - 사용자 ID: {}, 친구 ID: {}", userId, friendId);
    }

    /**
     * 친구 정보 리스트 조회.
     */
    public List<FriendInfoDto> getFriendInfoList(Integer userId) {
        List<Friend> friendList = friendRepository.findByIdUserId(userId);
        return friendList.stream().map(this::mapToFriendInfoDto).toList();
    }

    /**
     * 친구에게 일일 코인 전송. 같은 날 이미 전송한 경우 예외 발생.
     */
    public ResponseMessage dailyCoinSend(Integer senderId, Integer receiverId, Integer coinAmount) {
        Friend friend = findFriend(senderId, receiverId);
        LocalDateTime now = LocalDateTime.now();

        if (friend.getLastSend() != null && friend.getLastSend().toLocalDate()
            .isEqual(now.toLocalDate())) {
            throw new CoinAlreadySentException("오늘 이미 코인이 전송되었습니다.");
        }

        User receiver = userService.findUserById(receiverId);
        receiver.addCoins(coinAmount);
        userRepository.save(receiver);

        friend.send();
        friendRepository.save(friend);
        return new ResponseMessage("코인이 성공적으로 전송되었습니다. 수신자에게 전송된 코인: " + coinAmount);
    }

    private Friend findFriend(Integer userId, Integer friendId) {
        return friendRepository.findById(new FriendId(userId, friendId))
            .orElseThrow(() -> new FriendNotFoundException("친구 관계가 존재하지 않습니다."));
    }

    private void sendCoins(Integer userId, Integer friendId, Integer coinAmount) {
        User user = userService.findUserById(userId);
        User friendUser = userService.findUserById(friendId);

        user.addCoins(coinAmount);
        friendUser.addCoins(coinAmount);

        userRepository.save(user);
        userRepository.save(friendUser);
    }

    private void updateLastGreeting(Integer userId, Integer friendId) {
        Friend friend = findFriend(userId, friendId);
        friend.meet();
        friendRepository.save(friend);
    }

    public boolean areFriends(Integer userId, Integer friendUserId) {
        return friendRepository.existsById(new FriendId(userId, friendUserId));
    }

    private void createBidirectionalFriendship(Integer userId, Integer friendId) {
        saveFriendRelationship(userId, friendId);
        saveFriendRelationship(friendId, userId);
    }

    private void saveFriendRelationship(Integer userId, Integer friendId) {
        FriendId friendIdEntity = new FriendId(userId, friendId);
        Friend friend = Friend.builder().id(friendIdEntity).build();
        friendRepository.save(friend);
    }

    private FriendInfoDto mapToFriendInfoDto(Friend friend) {
        Integer friendId = friend.getId().getFriendId();
        User user = userService.findUserById(friendId);
        return new FriendInfoDto(friendId, user.getUserName(), user.getUserGoal(),
            ttubeotService.getDdubeotInfo(friendId));
    }
}
