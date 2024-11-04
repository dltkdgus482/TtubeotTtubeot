package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.enums.MissionStatus;
import com.user.userttubeot.ttubeot.domain.model.Mission;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.model.UserTtubeotMission;
import com.user.userttubeot.ttubeot.domain.repository.MissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotMissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
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

    // 매일 자정에 일일 미션 초기화
    @Scheduled(cron = "0 0 0 * * *")
    public void assignDailyMissions() {
        List<Mission> dailyMissions = getRandomMissionsByType(0); // missionType 0 (일일미션)
        assignMissionsToActiveTtubeots(dailyMissions);
    }

    // 매주 일요일 자정에 주간 미션 초기화
    @Scheduled(cron = "0 0 0 * * SUN")
    public void assignWeeklyMissions() {
        List<Mission> weeklyMissions = getRandomMissionsByType(1);
        assignMissionsToActiveTtubeots(weeklyMissions);
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
    private void assignMissionsToActiveTtubeots(List<Mission> missions) {
        // 상태가 0인 유저의 뚜벗을 조회
        List<UserTtuBeotOwnership> activeTtubeots = userTtubeotOwnershipRepository.findByTtubeotStatus(
            0);

        for (UserTtuBeotOwnership ttubeot : activeTtubeots) {
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
