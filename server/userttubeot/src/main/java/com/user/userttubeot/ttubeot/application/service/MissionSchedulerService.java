package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.enums.MissionStatus;
import com.user.userttubeot.ttubeot.domain.model.Mission;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.model.UserTtubeotMission;
import com.user.userttubeot.ttubeot.domain.repository.MissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotMissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
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

    /**
     * 매일 자정에 일일 미션 초기화
     */
    @Scheduled(cron = "0 30 00 * * *")
    @Transactional
    public void assignDailyMissions() {
        log.info("일일 미션 초기화 작업 시작");
        assignMissionsToActiveTtubeots(
            List.of(getMissionById(3)),
            "새로운 일일 미션 등장! 오늘은 꼭 성공해보세요!"
        );
        log.info("일일 미션 초기화 작업 완료");
    }

    /**
     * 매주 일요일 자정에 주간 미션 초기화
     */
    @Scheduled(cron = "0 0 0 * * SUN")
    @Transactional
    public void assignWeeklyMissions() {
        log.info("주간 미션 초기화 작업 시작");
        assignMissionsToActiveTtubeots(
            getRandomMissionsByType(1),
            "이번 주 주간 미션이 도착했습니다! 도전 준비 완료?"
        );
        log.info("주간 미션 초기화 작업 완료");
    }

    /**
     * 매시간 실행: 뚜벗 관심도 감소 및 졸업 처리
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void decreaseTtubeotInterestHourly() {
        log.info("뚜벗 관심도 감소 및 졸업 처리 작업 시작: {}", getCurrentTime());

        // 1. 관심도 감소 작업
        log.info("관심도 감소 작업 시작");
        List<User> users = userRepository.findAll();

        users.forEach(user -> {
            try {
                processUserInterestDecrease(user);
            } catch (Exception e) {
                log.error("사용자 ID {} 처리 중 예외 발생: {}", user.getUserId(), e.getMessage());
            }
        });
        log.info("관심도 감소 작업 완료");

        // 2. 졸업 처리 작업
        log.info("졸업 처리 작업 시작");
        ttubeotService.verifyAndGraduateAfter7Days();
        log.info("졸업 처리 작업 완료");

        log.info("뚜벗 관심도 감소 및 졸업 처리 작업 완료: {}", getCurrentTime());
    }

    private void processUserInterestDecrease(User user) {
        UserTtuBeotOwnership ownership = ttubeotService.getUserTtuBeotOwnership(user.getUserId());
        int currentInterest = ownership.getTtubeotInterest();
        ttubeotService.changeTtubeotInterest(ownership.getUserTtubeotOwnershipId(), -1);
        int updatedInterest = ownership.getTtubeotInterest();

        handleInterestNotifications(user, currentInterest, updatedInterest);

        if (updatedInterest <= 0) {
            handleBreakUp(ownership, user);
        }
    }

    private void handleInterestNotifications(User user, int currentInterest, int updatedInterest) {
        if (currentInterest >= 50 && updatedInterest < 50) {
            sendNotification(user, "모험 경고!", "뚜벗의 관심도가 50 아래로 떨어졌어요! 모험이 필요합니다.");
        } else if (currentInterest >= 30 && updatedInterest < 30) {
            sendNotification(user, "긴급 모험 소집!", "뚜벗의 관심도가 30 아래로 떨어졌어요! 뚜벗을 도와주세요.");
        }
    }

    private void handleBreakUp(UserTtuBeotOwnership ownership, User user) {
        ownership.updateBreakUpAndStatus(LocalDateTime.now(), 2);
        userTtubeotOwnershipRepository.save(ownership);
        sendNotification(user, "뚜벗이 떠났어요...", "관심이 부족해서 뚜벗이 떠나버렸어요.");
        log.info("뚜벗이 도망갔습니다 - 사용자 ID: {}", user.getUserId());
    }

    private void assignMissionsToActiveTtubeots(List<Mission> missions,
        String notificationMessage) {
        List<UserTtuBeotOwnership> activeTtubeots = userTtubeotOwnershipRepository.findByTtubeotStatus(
            0);

        activeTtubeots.forEach(ttubeot -> {
            notifyUserOfNewMission(ttubeot.getUser(), notificationMessage);
            missions.forEach(mission -> assignMissionIfNotExists(ttubeot, mission));
        });
    }

    private void assignMissionIfNotExists(UserTtuBeotOwnership ttubeot, Mission mission) {
        boolean alreadyAssigned = userTtubeotMissionRepository.existsByUserTtuBeotOwnershipAndMissionAndMissionStatus(
            ttubeot, mission, MissionStatus.IN_PROGRESS);

        if (!alreadyAssigned) {
            UserTtubeotMission userTtubeotMission = UserTtubeotMission.builder()
                .mission(mission)
                .userTtuBeotOwnership(ttubeot)
                .missionStatus(MissionStatus.IN_PROGRESS)
                .userTtubeotMissionActionCount(0)
                .build();
            userTtubeotMissionRepository.save(userTtubeotMission);
        }
    }

    private void notifyUserOfNewMission(User user, String message) {
        if (isValidFcmToken(user.getFcmToken())) {
            alertService.sendMissionNotification(user.getFcmToken(), "미션 알림", message);
        }
    }

    private boolean isValidFcmToken(String token) {
        return token != null && !token.isEmpty();
    }

    private Mission getMissionById(int missionId) {
        return missionRepository.findById(missionId)
            .orElseThrow(
                () -> new IllegalArgumentException("ID " + missionId + "에 해당하는 미션을 찾을 수 없습니다."));
    }

    private List<Mission> getRandomMissionsByType(int missionType) {
        Random random = new Random();
        return List.of(
            getRandomMission(missionType, 0, random),
            getRandomMission(missionType, 1, random),
            getRandomMission(missionType, 2, random)
        );
    }

    private Mission getRandomMission(int missionType, int missionTheme, Random random) {
        List<Mission> missions = missionRepository.findByMissionTypeAndMissionTheme(missionType,
            missionTheme);
        return missions.get(random.nextInt(missions.size()));
    }

    private void sendNotification(User user, String title, String message) {
        if (isValidFcmToken(user.getFcmToken())) {
            alertService.sendMissionNotification(user.getFcmToken(), title, message);
            log.info("알림 전송 완료 - 사용자 ID: {}, 제목: {}, 메시지: {}", user.getUserId(), title, message);
        } else {
            log.warn("유효하지 않은 FCM 토큰 - 사용자 ID: {}", user.getUserId());
        }
    }

    private String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
