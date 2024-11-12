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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class MissionSchedulerService {

    private final MissionRepository missionRepository;
    private final UserTtubeotMissionRepository userTtubeotMissionRepository;
    private final UserTtubeotOwnershipRepository userTtubeotOwnershipRepository;
    private final AlertServiceImpl alertService;
    private final UserRepository userRepository;

    // 매일 일정시간에 모든 유저에게 테스트 알림 전송
    @Scheduled(cron = "00 35 00 * * *")
    public void sendTestNotification() {
        // 모든 유저 조회
        List<User> users = userRepository.findAll();

        for (User user : users) {
            String fcmToken = user.getFcmToken();
            if (fcmToken != null && !fcmToken.isEmpty()) {
                alertService.sendMissionNotaification(fcmToken, "482야 레전드 불꺼라", "불끄고 자세요 여러분");
            }
        }
    }

    // 매일 자정에 일일 미션 초기화
    @Scheduled(cron = "0 35 12 * * *")
    public void assignDailyMissions() {
        Mission specificMission = missionRepository.findById(3)
            .orElseThrow(() -> new IllegalArgumentException("ID 3에 해당하는 미션을 찾을 수 없습니다.")); // missionType 0 (일일미션)
        List<Mission> dailyMissions = List.of(specificMission); // ID 3번 미션만 리스트에 포함
        assignMissionsToActiveTtubeots(dailyMissions, "일일 미션이 새로 할당되었습니다.");
    }

    // 매주 일요일 자정에 주간 미션 초기화
    @Scheduled(cron = "0 0 0 * * SUN")
    public void assignWeeklyMissions() {
        List<Mission> weeklyMissions = getRandomMissionsByType(1);
        assignMissionsToActiveTtubeots(weeklyMissions, "주간 미션이 새로 할당되었습니다.");
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
                alertService.sendMissionNotaification(fcmToken, "미션 알림", notificationMessage);
            }

            for (Mission mission : missions) {
                // builder pattern
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
