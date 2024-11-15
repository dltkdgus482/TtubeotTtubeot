package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.enums.MissionStatus;
import com.user.userttubeot.ttubeot.domain.model.Mission;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.model.UserTtubeotMission;
import com.user.userttubeot.ttubeot.domain.repository.MissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotMissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
import com.user.userttubeot.user.application.UserService;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@EnableScheduling
@RequiredArgsConstructor
public class MissionSchedulerService {

    private final MissionRepository missionRepository;
    private final UserTtubeotMissionRepository userTtubeotMissionRepository;
    private final UserTtubeotOwnershipRepository userTtubeotOwnershipRepository;
    private final AlertServiceImpl alertService;
    private final UserRepository userRepository;
    private final TtubeotService ttubeotService;
    private final UserService userService;

    // 매일 일정시간에 모든 유저에게 테스트 알림 전송
    @Scheduled(cron = "00 28 05 * * *")
    public void sendTestNotification() {
        // 모든 유저 조회
        List<User> users = userRepository.findAll();

        for (User user : users) {
            String fcmToken = user.getFcmToken();
            if (fcmToken != null && !fcmToken.isEmpty()) {
                alertService.sendMissionNotification(fcmToken, "482야 레전드 불꺼라", "불끄고 자세요 여러분");
            }
        }
    }

    // 매일 자정에 일일 미션 초기화
    @Scheduled(cron = "0 30 00 * * *")
    @Transactional
    public void assignDailyMissions() {
        Mission specificMission = missionRepository.findById(3)
            .orElseThrow(() -> new IllegalArgumentException(
                "ID 3에 해당하는 미션을 찾을 수 없습니다.")); // missionType 0 (일일미션)
        List<Mission> dailyMissions = List.of(specificMission); // ID 3번 미션만 리스트에 포함
        assignMissionsToActiveTtubeots(dailyMissions, "일일 미션이 새로 할당되었습니다.");
    }

    // 매주 일요일 자정에 주간 미션 초기화
    @Scheduled(cron = "0 0 0 * * SUN")
    public void assignWeeklyMissions() {
        List<Mission> weeklyMissions = getRandomMissionsByType(1);
        assignMissionsToActiveTtubeots(weeklyMissions, "주간 미션이 새로 할당되었습니다.");
    }

    // 뚜벗 관심 지수 감소
    @Scheduled(cron = "0 30 * * * *")
    public void decreaseTtubeotInterestHourly() {
        String currentTime = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        log.info("매시간 정각에 실행되는 작업: ttubeot_interest 감소 작업 시작. 현재 시간: {}", currentTime);

        List<User> allUsers = userRepository.findAll();
        log.info("총 {}명의 사용자에 대해 흥미 감소 작업을 수행합니다. 현재 시간: {}", allUsers.size(), currentTime);

        for (User user : allUsers) {
            processUserInterestDecrease(user);
        }
        log.info("모든 사용자에 대한 ttubeot_interest 감소 작업 완료. 현재 시간: {}", currentTime);
    }

    @Transactional
    public void processUserInterestDecrease(User user) {
        Integer userId = user.getUserId();
        log.info("사용자 ID {}에 대한 ttubeot_interest 감소 작업을 시작합니다.", userId);

        UserTtuBeotOwnership userTtuBeotOwnership = ttubeotService.getUserTtuBeotOwnership(userId);
        Long ownershipId = userTtuBeotOwnership.getUserTtubeotOwnershipId();

        Integer currentInterest = ttubeotService.getTtubeotInterest(userId).getTtubeotInterest();
        log.info("현재 관심도: {} (소유 ID: {})", currentInterest, ownershipId);

        UserTtuBeotOwnership updatedUserTtuBeotOwnership = ttubeotService.changeTtubeotInterest(
            ownershipId, -1);

        Integer updatedInterest = updatedUserTtuBeotOwnership.getTtubeotInterest();
        log.info("업데이트된 관심도: {} (소유 ID: {})", updatedInterest, ownershipId);

        // 관심도 변화에 따른 알림 전송
        checkAndSendNotification(user, currentInterest, updatedInterest);

        // 관심도가 0 이하인 경우, 상태 업데이트
        if (updatedInterest <= 0) {
            userTtuBeotOwnership.updateBreakUpAndStatus(LocalDateTime.now(), 2);
            log.info("관심도가 0 이하로 떨어져 뚜벗이 도망갔습니다. (사용자 ID: {})", userId);
        }

        userTtubeotOwnershipRepository.save(updatedUserTtuBeotOwnership);
        log.info("사용자 ID {}의 ttubeot_interest 감소 작업이 완료되었습니다.", userId);
    }

    private void checkAndSendNotification(User user, Integer currentInterest,
        Integer updatedInterest) {
        if (currentInterest >= 50 && updatedInterest < 50) {
            sendNotification(user, "모험 가자", "관심도가 50 미만으로 떨어졌습니다. 추가적인 활동이 필요합니다!");
            log.info("관심도가 50 미만으로 떨어져 알림을 전송했습니다. (사용자 ID: {})", user.getUserId());
        } else if (currentInterest >= 30 && updatedInterest < 30) {
            sendNotification(user, "모험 가자", "관심도가 30 미만으로 떨어졌습니다. 추가적인 활동이 필요합니다!");
            log.info("관심도가 30 미만으로 떨어져 알림을 전송했습니다. (사용자 ID: {})", user.getUserId());
        }
    }

    private void sendNotification(User user, String title, String message) {
        String fcmToken = user.getFcmToken();
        if (fcmToken == null || fcmToken.isEmpty()) {
            log.warn("사용자의 FCM 토큰이 유효하지 않습니다. 알림을 전송할 수 없습니다. (사용자 ID: {})", user.getUserId());
            return;
        }
        alertService.sendMissionNotification(fcmToken, title, message);
        log.info("알림 전송 완료 - 사용자 ID: {}, 제목: {}, 메시지: {}", user.getUserId(), title, message);
    }


    // missionType과 missionTheme에 따라 랜덤으로 미션 선택
    private List<Mission> getRandomMissionsByType(int missionType) {
        List<Mission> interactionMissions = missionRepository.findByMissionTypeAndMissionTheme(
            missionType, 0);
        List<Mission> adventureMissions = missionRepository.findByMissionTypeAndMissionTheme(
            missionType, 1);
        List<Mission> socialMissions = missionRepository.findByMissionTypeAndMissionTheme(
            missionType, 2);

        Random random = new Random();
        return List.of(
            interactionMissions.get(random.nextInt(interactionMissions.size())),
            adventureMissions.get(random.nextInt(adventureMissions.size())),
            socialMissions.get(random.nextInt(socialMissions.size()))
        );
    }

    // 상태가 0인 활성 뚜벗에게 미션을 할당
    private void assignMissionsToActiveTtubeots(List<Mission> missions,
        String notificationMessage) {
        // 상태가 0인 유저의 뚜벗을 조회
        List<UserTtuBeotOwnership> activeTtubeots = userTtubeotOwnershipRepository.findByTtubeotStatus(
            0);

        for (UserTtuBeotOwnership ttubeot : activeTtubeots) {
            String fcmToken = ttubeot.getUser().getFcmToken();
            if (fcmToken != null && !fcmToken.isEmpty()) {
                alertService.sendMissionNotification(fcmToken, "미션 알림", notificationMessage);
            }

            for (Mission mission : missions) {
                // 이미 동일한 미션이 할당되어 있는지 확인
                boolean isMissionAlreadyAssigned = userTtubeotMissionRepository.existsByUserTtuBeotOwnershipAndMissionAndMissionStatus(
                    ttubeot, mission, MissionStatus.IN_PROGRESS);
                if (!isMissionAlreadyAssigned) {
                    // 새 미션 할당
                    UserTtubeotMission userTtubeotMission = UserTtubeotMission.builder()
                        .mission(mission)
                        .userTtuBeotOwnership(ttubeot)
                        .missionStatus(MissionStatus.IN_PROGRESS)
                        .userTtubeotMissionActionCount(0)
                        .build();
                    userTtubeotMissionRepository.save(userTtubeotMission);
                }
            }
        }
    }
}
