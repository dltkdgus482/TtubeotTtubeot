package com.user.userttubeot.ttubeot.domain.repository;

import com.user.userttubeot.ttubeot.domain.model.Mission;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Integer> {

    // missionType과 missionTheme을 기준으로 미션을 조회
    List<Mission> findByMissionTypeAndMissionTheme(int missionType, int missionTheme);

}
