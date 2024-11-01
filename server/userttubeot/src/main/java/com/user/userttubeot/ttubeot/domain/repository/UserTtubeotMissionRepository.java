package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.enums.MissionStatus;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.model.UserTtubeotMission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTtubeotMissionRepository extends JpaRepository<UserTtubeotMission, Long> {

    // 특정 뚜벗이 진행 중인 일일 미션 조회
    List<UserTtubeotMission> findByUserTtuBeotOwnershipAndMissionTypeAndMissionStatus(
        UserTtuBeotOwnership userTtuBeotOwnership, Integer missionType,
        MissionStatus missionStatus);

}
