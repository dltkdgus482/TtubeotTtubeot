package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.MissionRewardRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.MissionRewardResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.RecentBreakupTtubeotResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogListResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotNameRegisterRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoListDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotMissionListResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotMissionResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.MissionRegistToDbDTO;
import com.user.userttubeot.ttubeot.domain.dto.backend.TtubeotRegistToDbDTO;
import com.user.userttubeot.ttubeot.domain.enums.MissionStatus;
import com.user.userttubeot.ttubeot.domain.model.Mission;
import com.user.userttubeot.ttubeot.domain.model.Ttubeot;
import com.user.userttubeot.ttubeot.domain.model.TtubeotLog;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.model.UserTtubeotMission;
import com.user.userttubeot.ttubeot.domain.repository.MissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.TtubeotLogRepository;
import com.user.userttubeot.ttubeot.domain.repository.TtubeotRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotMissionRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
import com.user.userttubeot.ttubeot.global.exception.TtubeotNotFoundException;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TtubeotServiceImpl implements TtubeotService {

    private final TtubeotLogRepository ttubeotLogRepository;
    private final UserTtubeotOwnershipRepository userTtubeotOwnershipRepository;
    private final TtubeotRepository TtubeotRepository;
    private final UserRepository userRepository;
    private final MissionRepository missionRepository;
    private final UserTtubeotMissionRepository userTtubeotMissionRepository;

    @Override
    public void addTtubeotLog(Long userTtubeotOwnershipId,
        TtubeotLogRequestDTO ttubeotLogRequestDTO) {

        // 정상 상태인 뚜벗 찾기 (상태가 0인 경우가 정상)
        UserTtuBeotOwnership ownership = userTtubeotOwnershipRepository
            .findByUserTtubeotOwnershipIdAndTtubeotStatus(userTtubeotOwnershipId, 0)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 정상 상태 뚜벗이 없습니다."));

        // 로그 저장
        TtubeotLog ttubeotLog = TtubeotLog.builder()
            .ttubeotLogType(ttubeotLogRequestDTO.getTtubeotLogType())
            .createdAt(LocalDateTime.now())
            .userTtuBeotOwnership(ownership)
            .build();

        ttubeotLogRepository.save(ttubeotLog);
    }

    // 유저의 뚜벗 아이디 조회
    @Override
    public Long getTtubeotOwnershipId(int userId) {
        return userTtubeotOwnershipRepository.findByUser_UserIdAndTtubeotStatus(userId, 0)
            .stream().findFirst()
            .map(UserTtuBeotOwnership::getUserTtubeotOwnershipId)
            .orElseThrow(() -> new TtubeotNotFoundException("보유하고 있는 정상 상태의 뚜벗이 없습니다."));
    }

    // 유저의 뚜벗 상세 정보 조회 -> 정상인 것만.
    @Override
    public UserTtubeotInfoResponseDTO getDdubeotInfo(int userId) {
        UserTtuBeotOwnership userTtuBeotOwnership = userTtubeotOwnershipRepository.findByUser_UserIdAndTtubeotStatus(
                userId, 0).stream()
            .findFirst()
            .orElseThrow(() -> new TtubeotNotFoundException("보유하고 있는 뚜벗이 없어요."));

        // DTO로 변환하여 반환
        return UserTtubeotInfoResponseDTO.builder()
            .ttubeotId(userTtuBeotOwnership.getTtubeot().getTtubeotId())
            .ttubeotType(userTtuBeotOwnership.getTtubeot().getTtubeotType())
            .ttubeotName(userTtuBeotOwnership.getTtubeotName())
            .ttubeotScore(userTtuBeotOwnership.getTtubeotScore())
            .createdAt(userTtuBeotOwnership.getCreatedAt())
            .build();
    }

    @Override
    public TtubeotDrawResponseDTO drawTtubeot(Integer userId,
        TtubeotDrawRequestDTO ttubeotDrawRequestDTO) {
        int type = ttubeotDrawRequestDTO.getType();
        TtubeotDrawResponseDTO responseDTO;

        switch (type) {
            case 1:
                responseDTO = drawRandomTtubeot(userId);
                break;
            case 2:
                responseDTO = drawFixedTtubeot(userId, ttubeotDrawRequestDTO.getTtubeotId());
                break;
            case 3:
                responseDTO = drawTtubeotByGrade(userId, ttubeotDrawRequestDTO.getGrade());
                break;
            default:
                throw new IllegalArgumentException("뽑기 타입을 1~3 사이의 숫자로 선택해주십시오.");
        }
        return responseDTO;
    }

    @Override
    public void registerTtubeotName(TtubeotNameRegisterRequestDTO ttubeotNameRegisterRequestDTO) {
        log.info(
            "registerTtubeotName 호출됨. 요청 데이터: userTtubeotOwnershipId={}, userTtubeotOwnershipName={}",
            ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipId(),
            ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipName());

        Optional<UserTtuBeotOwnership> ownershipOpt = userTtubeotOwnershipRepository.findById(
            ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipId());

        log.info("DTO에서 전달된 userTtubeotOwnershipId: {}",
            ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipId());

        if (ownershipOpt.isPresent()) {
            UserTtuBeotOwnership ownership = ownershipOpt.get();

            // 엔티티의 비즈니스 메서드를 통해 이름 업데이트
            ownership.updateTtubeotName(
                ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipName());

            // 엔티티 저장
            userTtubeotOwnershipRepository.save(ownership);
        } else {
            throw new IllegalArgumentException("해당 ID에 해당하는 뚜벗 소유 정보가 없습니다.");
        }

    }

    @Override
    public UserTtubeotGraduationInfoListDTO getUserTtubeotGraduationInfoList(int userId) {
        // userId가 소유했던 뚜벗 목록을 조회
        List<UserTtuBeotOwnership> graduatedTtubeots =
            userTtubeotOwnershipRepository.findAllByUser_UserId(userId);

        // 로그 테이블 접근하여 함께한 모험 횟수를 조회 (type = 3)

        // 조회된 entity 목록을 dto로 변환
        List<UserTtubeotGraduationInfoDTO> graduationInfoListDTO = graduatedTtubeots.stream()
            .map(ownership -> {
                UserTtubeotGraduationInfoDTO dto = new UserTtubeotGraduationInfoDTO();
                dto.setTtubeotName(ownership.getTtubeotName());
                dto.setTtubeotScore(ownership.getTtubeotScore());
                dto.setBreakUp(ownership.getBreakUp());
                dto.setCreatedAt(ownership.getCreatedAt());
                dto.setTtubeotId(ownership.getTtubeot().getTtubeotId());
                dto.setTtubeotStatus(ownership.getTtubeotStatus());

                // 로그테이블에서 모험 횟수 조회
                int adventureCount = ttubeotLogRepository.countLogsByOwnershipIdAndLogType(
                    ownership.getUserTtubeotOwnershipId());
                dto.setAdventureCount(adventureCount);
                return dto;
            })
            .collect(Collectors.toList());

        // DTO리스트를 UserTtubeotInfoListDTO에 담아서
        UserTtubeotGraduationInfoListDTO response = new UserTtubeotGraduationInfoListDTO();
        response.setTtubeotGraduationInfoDtoList(graduationInfoListDTO);

        // 정상 졸업한 뚜벗들의 정보를 리스트에 담아 return
        return response;
    }

    @Override
    public TtubeotDrawResponseDTO drawRandomTtubeot(Integer userId) {
        Random random = new Random();

        // 1부터 3까지의 랜덤한 타입을 선택
        int randomType = random.nextInt(3) + 1;

        // 해당 타입의 모든 뚜벗 가져오기
        List<Ttubeot> ttubeotsByType = TtubeotRepository.findAllByTtubeotType(randomType);

        if (ttubeotsByType.isEmpty()) {
            throw new IllegalArgumentException("해당 타입의 뚜벗이 존재하지 않습니다.");
        }

        // 해당 타입의 뚜벗 목록 중 하나를 랜덤하게 선택
        Ttubeot selectedTtubeot = ttubeotsByType.get(random.nextInt(ttubeotsByType.size()));

        return createTtubeotDrawResponseDTO(userId, selectedTtubeot);
    }

    @Override
    public TtubeotDrawResponseDTO drawFixedTtubeot(Integer userId, Integer ttubeotId) {
        Ttubeot selectedTtubeot = TtubeotRepository.findById(ttubeotId)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 뚜벗을 찾을 수 없습니다."));
        return createTtubeotDrawResponseDTO(userId, selectedTtubeot);
    }

    @Override
    public TtubeotDrawResponseDTO drawTtubeotByGrade(Integer userId, Integer grade) {
        Random random = new Random();

        // 해당 타입의 모든 뚜벗 가져오기
        List<Ttubeot> ttubeotsByType = TtubeotRepository.findAllByTtubeotType(grade);

        if (ttubeotsByType.isEmpty()) {
            throw new IllegalArgumentException("해당 타입의 뚜벗이 존재하지 않습니다.");
        }

        // 해당 타입의 뚜벗 목록 중 하나를 랜덤하게 선택
        Ttubeot selectedTtubeot = ttubeotsByType.get(random.nextInt(ttubeotsByType.size()));

        return createTtubeotDrawResponseDTO(userId, selectedTtubeot);
    }

    @Override
    public ResponseEntity<TtubeotLogListResponseDTO> checkTtubeotStatus(Integer userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threeDaysAgo = now.minusDays(3);

        // 0. 유저가 보유중인 뚜벗을 조회
        Optional<UserTtuBeotOwnership> ownershipOpt = userTtubeotOwnershipRepository
            .findByUser_UserIdAndTtubeotStatus(userId, Integer.valueOf(0));

        // 정상 상태의 뚜벗이 없으면 204 상태 코드와 빈 바디 반환
        if (ownershipOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new TtubeotLogListResponseDTO());
        }

        UserTtuBeotOwnership ownership = ownershipOpt.get();

        // 뚜벗의 생성일자 확인
        LocalDateTime createdAt = ownership.getCreatedAt();

        // 생성 후 3일이 안 지났으면 break_up과 상태 변경 생략
        if (createdAt.isAfter(threeDaysAgo)) {
            return ResponseEntity.ok(TtubeotLogListResponseDTO.builder()
                .ttubeotLogResponseList(Collections.emptyList())
                .build());
        }

        // 1. 3일 전 이후의 로그를 조회
        List<TtubeotLog> recentLogs = ttubeotLogRepository.findByUserTtuBeotOwnership_User_UserIdAndCreatedAtAfter(
            userId, threeDaysAgo);

        // 2. 로그 타입 검사 및 필요한 갱신 작업
        Set<Integer> logTypes = recentLogs.stream()
            .map(TtubeotLog::getTtubeotLogType)
            .collect(Collectors.toSet());

        // 3. 로그 타입(0 ~ 3) 중 하나라도 누락된 경우 break_up을 갱신
        if (!(logTypes.contains(0) && logTypes.contains(1) && logTypes.contains(2)
            && logTypes.contains(3))) {
            ownership.updateBreakUpAndStatus(now, 2);  // 현재 시점으로 break_up 갱신 및 중도 퇴소 처리
            userTtubeotOwnershipRepository.save(ownership);
            return ResponseEntity.ok(TtubeotLogListResponseDTO.builder()
                .ttubeotLogResponseList(Collections.emptyList())
                .build());  // 빈 리스트 반환 -> early return
        }

        // 4. 3일 전 로그 필터링 및 반환 준비
        List<TtubeotLog> threeDaysLogs = ttubeotLogRepository.findByUserTtuBeotOwnership_User_UserIdAndCreatedAtBetween(
            userId, threeDaysAgo, now);

        // 5. 로그 데이터를 DTO로 변환하여 반환
        List<TtubeotLogResponseDTO> logsDtos = threeDaysLogs.stream()
            .map(log -> new TtubeotLogResponseDTO(log.getTtubeotLogType(), log.getCreatedAt()))
            .collect(Collectors.toList());

        return ResponseEntity.ok(TtubeotLogListResponseDTO.builder()
            .ttubeotLogResponseList(logsDtos)
            .build());
    }

    @Override
    public void registTtubeot(TtubeotRegistToDbDTO ttubeotRegistToDbDTO) {
        Ttubeot ttubeot = Ttubeot.fromDTO(ttubeotRegistToDbDTO);

        TtubeotRepository.save(ttubeot);
    }

    @Override
    public void registMission(MissionRegistToDbDTO missionRegistDTO) {
        Mission mission = Mission.fromDTO(missionRegistDTO);

        missionRepository.save(mission);
    }

    @Override
    public UserTtubeotMissionListResponseDTO getUserDailyMissionList(int userId) {
        // 1. 유저가 보유 중인 뚜벗 중 정상 상태 (0)인 뚜벗을 조회합니다.
        Optional<UserTtuBeotOwnership> optionalUserTtubeot = userTtubeotOwnershipRepository.findByUser_UserIdAndTtubeotStatus(
            userId, 0);

        // 정상 상태의 뚜벗이 없다면 예외를 발생시킵니다.
        UserTtuBeotOwnership userTtubeot = optionalUserTtubeot.orElseThrow(
            () -> new IllegalArgumentException("정상 상태의 뚜벗이 존재하지 않습니다."));

        // 2. 해당 뚜벗이 현재 진행하고 있는 일일 미션들을 조회합니다.
        List<UserTtubeotMission> dailyMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 0,
            MissionStatus.IN_PROGRESS);

        // 3. 미션과 미션 진행 정보도 포함하여 DTO로 변환
        List<UserTtubeotMissionResponseDTO> missionDTOs = dailyMissions.stream()
            .map(mission -> {
                return new UserTtubeotMissionResponseDTO(
                    mission.getMissionStatus().name(),
                    mission.getMission().getMissionTheme(),
                    mission.getMission().getMissionType(),
                    mission.getMission().getMissionTargetCount(),
                    mission.getMission().getMissionName(),
                    mission.getMission().getMissionExplanation(),
                    mission.getUserTtubeotMissionActionCount()
                );
            })
            .collect(Collectors.toList());

        return new UserTtubeotMissionListResponseDTO(missionDTOs);
    }

    @Override
    public UserTtubeotMissionListResponseDTO getUserWeeklyMissionList(int userId) {
        // 1. 유저가 보유 중인 뚜벗 중 정상 상태 (0)인 뚜벗을 조회합니다.
        Optional<UserTtuBeotOwnership> optionalUserTtubeot = userTtubeotOwnershipRepository.findByUser_UserIdAndTtubeotStatus(
            userId, 0);

        // 정상 상태의 뚜벗이 없다면 예외를 발생시킵니다.
        UserTtuBeotOwnership userTtubeot = optionalUserTtubeot.orElseThrow(
            () -> new IllegalArgumentException("정상 상태의 뚜벗이 존재하지 않습니다."));

        // 2. 해당 뚜벗이 현재 진행하고 있는 주간 미션들을 조회합니다.
        List<UserTtubeotMission> dailyMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 1,
            MissionStatus.IN_PROGRESS);

        // 3. 미션과 미션 진행 정보도 포함하여 DTO로 변환
        List<UserTtubeotMissionResponseDTO> missionDTOs = dailyMissions.stream()
            .map(mission -> {
                Mission missionInfo = mission.getMission();  // 미션 정보 가져오기
                return new UserTtubeotMissionResponseDTO(
                    mission.getMissionStatus().name(),
                    mission.getMission().getMissionTheme(),
                    mission.getMission().getMissionType(),
                    mission.getMission().getMissionTargetCount(),
                    mission.getMission().getMissionName(),
                    mission.getMission().getMissionExplanation(),
                    mission.getUserTtubeotMissionActionCount()  // 미션 목표 수량
                );
            })
            .collect(Collectors.toList());

        return new UserTtubeotMissionListResponseDTO(missionDTOs);
    }

    @Override
    @Transactional
    public MissionRewardResponseDTO requestCoin(int userId,
        MissionRewardRequestDTO missionRewardRequestDTO) {
        // 1. 유저가 소유하고있는 정상상태의 뚜벗을 조회합니다.
        Optional<UserTtuBeotOwnership> optionalUserTtubeot = userTtubeotOwnershipRepository.findByUser_UserIdAndTtubeotStatus(
            userId, 0);
        if (optionalUserTtubeot.isEmpty()) {
            throw new TtubeotNotFoundException("정상 상태의 뚜벗이 없습니다.");
        }

        // 보상 코인
        int steps = missionRewardRequestDTO.getSteps();
        int totalRewardCoins = 0; // 총 보상 코인
        StringBuilder completionMessage = new StringBuilder();

        UserTtuBeotOwnership userTtubeot = optionalUserTtubeot.get();

        // 2. 진행중인 일간 미션 조회
        List<UserTtubeotMission> adventureDailyMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionThemeAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 1, 0, MissionStatus.IN_PROGRESS);
        // 진행중인 주간 미션 조회
        List<UserTtubeotMission> adventureWeeklyMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionThemeAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 1, 1, MissionStatus.IN_PROGRESS);

        // 항상 존재합니다.
        if (adventureDailyMissions.isEmpty()) {
            throw new IllegalArgumentException("진행 중인 모험 미션이 없습니다.");
        }

        // 3. 일간 및 주간 미션 처리
        for (UserTtubeotMission mission : adventureDailyMissions) {
            totalRewardCoins += processMission(mission, mission.getMission(), steps,
                completionMessage, "일간");
        }

        for (UserTtubeotMission mission : adventureWeeklyMissions) {
            totalRewardCoins += processMission(mission, mission.getMission(), steps,
                completionMessage, "주간");
        }

        // 4. 결과 반환
        return new MissionRewardResponseDTO(
            totalRewardCoins,
            !completionMessage.isEmpty() ? completionMessage.toString() : "미션 진행 중입니다."
        );
    }

    private int processMission(UserTtubeotMission userMission, Mission mission, int steps,
        StringBuilder messageBuilder, String missionType) {
        int currentActionCount = userMission.getUserTtubeotMissionActionCount();
        int targetCount = mission.getMissionTargetCount();
        int maxReward = mission.getMissionReward();

        // 걸음수 누적
        userMission.accumulateActionCount(steps);

        // 현재 진행률 계산
        double progressRate = Math.min(
            (double) userMission.getUserTtubeotMissionActionCount() / targetCount, 1.0);

        // 비례 보상 계산 (진행 중에도 일부 보상 지급)
        int reward = (int) (progressRate * maxReward);

        // 목표치 도달 여부 판단
        if (progressRate >= 1.0) {
            // 미션 완료 처리
            userMission.completeMission();
            messageBuilder.append(missionType).append(" 미션을 완료하셨습니다! ");
        }

        // 진행 중 상태 또는 완료된 상태 저장
        userTtubeotMissionRepository.save(userMission);

        // 보상 반환
        return reward;
    }

    @Override
    public RecentBreakupTtubeotResponseDTO getRecentBreakUpTtubeot(int userId) {
        // 가장 최근에 헤어진 뚜벗 조회
        Optional<UserTtuBeotOwnership> recentBreakup = userTtubeotOwnershipRepository
            .findFirstByUser_UserIdAndBreakUpIsNotNullOrderByBreakUpDesc(userId);

        // 뚜벗이 없다면 null 반환 대신 메시지 설정
        if (recentBreakup.isEmpty()) {
            return null; // 컨트롤러에서 "없다" 처리
        }

        // DTO로 변환
        UserTtuBeotOwnership ownership = recentBreakup.get();
        RecentBreakupTtubeotResponseDTO dto = new RecentBreakupTtubeotResponseDTO();
        dto.setTtubeotId(ownership.getTtubeot().getTtubeotId());
        dto.setBreakUp(ownership.getBreakUp());
        dto.setUserTtubeotOwnershipId(ownership.getUserTtubeotOwnershipId());
        dto.setGraduationStatus(ownership.getTtubeotStatus());

        return dto;
    }

    // TtubeotDrawResponseDTO 생성 메서드
    private TtubeotDrawResponseDTO createTtubeotDrawResponseDTO(Integer userId,
        Ttubeot selectedTtubeot) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다."));

        // 새로운 UserTtuBeotOwnership 객체 생성 및 저장
        UserTtuBeotOwnership ownership = UserTtuBeotOwnership.builder()
            .user(user)
            .ttubeot(selectedTtubeot)
            .ttubeotName(null) // 초기 이름은 null로 설정
            .build();
        userTtubeotOwnershipRepository.save(ownership);

        // 응답 DTO 생성 및 반환
        return new TtubeotDrawResponseDTO(ownership.getUserTtubeotOwnershipId(),
            selectedTtubeot.getTtubeotId());
    }
}
