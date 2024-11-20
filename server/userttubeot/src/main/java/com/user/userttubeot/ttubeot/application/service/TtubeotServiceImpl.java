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
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotExperienceResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGetIdRespDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoListDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInterestResponseDTO;
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
import com.user.userttubeot.ttubeot.global.exception.DailyLimitReachedException;
import com.user.userttubeot.ttubeot.global.exception.InsufficientFundsException;
import com.user.userttubeot.ttubeot.global.exception.TtubeotNotFoundException;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TtubeotServiceImpl implements TtubeotService {

    private final TtubeotLogRepository ttubeotLogRepository;
    private final UserTtubeotOwnershipRepository userTtubeotOwnershipRepository;
    private final TtubeotRepository ttubeotRepository;
    private final UserRepository userRepository;
    private final MissionRepository missionRepository;
    private final UserTtubeotMissionRepository userTtubeotMissionRepository;

    @Override
    @Transactional
    public UserTtubeotExperienceResponseDTO addTtubeotLog(Integer userId,
        TtubeotLogRequestDTO ttubeotLogRequestDTO) {

        Integer logType = ttubeotLogRequestDTO.getTtubeotLogType();

        log.info("addTtubeotLog 시작 - userId: {}, LogType: {}", userId, logType);

        UserTtuBeotOwnership ownership = findUserTtubeotOwnership(userId);

        checkDailyLimit(logType, ownership);

        TtubeotLog ttubeotLog = saveTtubeotLog(logType, ownership);

        int experienceToAdd = calculateExperienceToAdd(logType);

        updateInterest(ownership, experienceToAdd);

        return new UserTtubeotExperienceResponseDTO(ownership.getTtubeotInterest());
    }

    @Override
    public Long getTtubeotOwnershipId(int userId) {
        UserTtuBeotOwnership ownership = findUserTtubeotOwnership(userId);
        Long ownershipId = ownership.getUserTtubeotOwnershipId();
        log.info("getTtubeotOwnershipId - userId: {}, ownershipId: {}", userId, ownershipId);
        return ownershipId;
    }

    @Override
    public UserTtubeotInfoResponseDTO getDdubeotInfo(int userId) {
        UserTtuBeotOwnership ownership = findUserTtubeotOwnership(userId);
        log.info("getDdubeotInfo - userId: {}, ownershipId: {}", userId,
            ownership.getUserTtubeotOwnershipId());

        return UserTtubeotInfoResponseDTO.builder()
            .ttubeotId(ownership.getTtubeot().getTtubeotId())
            .ttubeotType(ownership.getTtubeot().getTtubeotType())
            .ttubeotName(ownership.getTtubeotName())
            .ttubeotScore(ownership.getTtubeotScore())
            .createdAt(ownership.getCreatedAt())
            .build();
    }

    @Override
    @Transactional
    public TtubeotDrawResponseDTO drawTtubeot(Integer userId,
        TtubeotDrawRequestDTO ttubeotDrawRequestDTO) {
        int type = ttubeotDrawRequestDTO.getType();
        int price = ttubeotDrawRequestDTO.getPrice();

        log.info("drawTtubeot 시작 - userId: {}, type: {}, price: {}", userId, type, price);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다."));

        if (user.getUserCoin() < price) {
            throw new InsufficientFundsException("보유 코인이 부족하여 뚜벗을 뽑을 수 없습니다.");
        }

        user.deductCoins(price);
        userRepository.save(user);

        log.info("유저 코인 차감 완료 - userId: {}, 남은 코인: {}", userId, user.getUserCoin());

        TtubeotDrawResponseDTO responseDTO = switch (type) {
            case 1 -> drawRandomTtubeot(userId);
            case 2 -> drawFixedTtubeot(userId, ttubeotDrawRequestDTO.getTtubeotId());
            case 3 -> drawTtubeotByGrade(userId, ttubeotDrawRequestDTO.getGrade());
            default -> throw new IllegalArgumentException("뽑기 타입을 1~3 사이의 숫자로 선택해주십시오.");
        };

        responseDTO.setUserCoin(user.getUserCoin());

        log.info("뚜벗 뽑기 완료 - userId: {}, 뽑은 뚜벗 정보: {}", userId, responseDTO);

        return responseDTO;
    }

    @Override
    public void registerTtubeotName(TtubeotNameRegisterRequestDTO ttubeotNameRegisterRequestDTO) {
        log.info(
            "registerTtubeotName 호출됨. 요청 데이터: userTtubeotOwnershipId={}, userTtubeotOwnershipName={}",
            ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipId(),
            ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipName());

        UserTtuBeotOwnership ownership = userTtubeotOwnershipRepository.findById(
                ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipId())
            .orElseThrow(() -> new IllegalArgumentException("해당 ID에 해당하는 뚜벗 소유 정보가 없습니다."));

        ownership.updateTtubeotName(ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipName());

        userTtubeotOwnershipRepository.save(ownership);

        log.info("뚜벗 이름 등록 완료 - ownershipId: {}, 새로운 이름: {}",
            ownership.getUserTtubeotOwnershipId(), ownership.getTtubeotName());
    }

    @Override
    public UserTtubeotGraduationInfoListDTO getUserTtubeotGraduationInfoList(int userId) {
        log.info("getUserTtubeotGraduationInfoList 호출됨 - userId: {}", userId);

        List<UserTtuBeotOwnership> graduatedTtubeots = userTtubeotOwnershipRepository.findAllByUser_UserId(
            userId);

        graduatedTtubeots.sort((o1, o2) -> {
            if (o1.getBreakUp() == null && o2.getBreakUp() == null) {
                return 0;
            }
            if (o1.getBreakUp() == null) {
                return 1;
            }
            if (o2.getBreakUp() == null) {
                return -1;
            }
            return o2.getBreakUp().compareTo(o1.getBreakUp());
        });

        List<UserTtubeotGraduationInfoDTO> graduationInfoListDTO = graduatedTtubeots.stream()
            .map(ownership -> {
                UserTtubeotGraduationInfoDTO dto = new UserTtubeotGraduationInfoDTO();
                dto.setTtubeotName(ownership.getTtubeotName());
                dto.setTtubeotScore(ownership.getTtubeotScore());
                dto.setBreakUp(ownership.getBreakUp());
                dto.setCreatedAt(ownership.getCreatedAt());
                dto.setTtubeotId(ownership.getTtubeot().getTtubeotId());
                dto.setTtubeotStatus(ownership.getTtubeotStatus());

                int adventureCount = ttubeotLogRepository.countLogsByOwnershipIdAndLogType(
                    ownership.getUserTtubeotOwnershipId());
                dto.setAdventureCount(adventureCount);
                return dto;
            })
            .collect(Collectors.toList());

        UserTtubeotGraduationInfoListDTO response = new UserTtubeotGraduationInfoListDTO();
        response.setTtubeotGraduationInfoDtoList(graduationInfoListDTO);

        log.info("졸업 앨범 조회 완료 - userId: {}, 졸업 뚜벗 수: {}", userId, graduationInfoListDTO.size());

        return response;
    }

    @Override
    public TtubeotDrawResponseDTO drawRandomTtubeot(Integer userId) {
        log.info("drawRandomTtubeot 호출됨 - userId: {}", userId);

        Random random = new Random();
        int randomType = random.nextInt(3) + 1;

        List<Ttubeot> ttubeotsByType = ttubeotRepository.findAllByTtubeotType(randomType);

        if (ttubeotsByType.isEmpty()) {
            throw new IllegalArgumentException("해당 타입의 뚜벗이 존재하지 않습니다.");
        }

        Ttubeot selectedTtubeot = ttubeotsByType.get(random.nextInt(ttubeotsByType.size()));

        return createTtubeotDrawResponseDTO(userId, selectedTtubeot);
    }

    @Override
    public TtubeotDrawResponseDTO drawFixedTtubeot(Integer userId, Integer ttubeotId) {
        log.info("drawFixedTtubeot 호출됨 - userId: {}, ttubeotId: {}", userId, ttubeotId);

        Ttubeot selectedTtubeot = ttubeotRepository.findById(ttubeotId)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 뚜벗을 찾을 수 없습니다."));

        return createTtubeotDrawResponseDTO(userId, selectedTtubeot);
    }

    @Override
    public TtubeotDrawResponseDTO drawTtubeotByGrade(Integer userId, Integer grade) {
        log.info("drawTtubeotByGrade 호출됨 - userId: {}, grade: {}", userId, grade);

        Random random = new Random();

        List<Ttubeot> ttubeotsByType = ttubeotRepository.findAllByTtubeotType(grade);

        if (ttubeotsByType.isEmpty()) {
            throw new IllegalArgumentException("해당 타입의 뚜벗이 존재하지 않습니다.");
        }

        Ttubeot selectedTtubeot = ttubeotsByType.get(random.nextInt(ttubeotsByType.size()));

        return createTtubeotDrawResponseDTO(userId, selectedTtubeot);
    }

    @Override
    public ResponseEntity<TtubeotLogListResponseDTO> checkTtubeotStatus(Integer userId) {
        log.info("checkTtubeotStatus 호출됨 - userId: {}", userId);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threeDaysAgo = now.minusDays(3);

        Optional<UserTtuBeotOwnership> ownershipOpt = userTtubeotOwnershipRepository
            .findByUser_UserIdAndTtubeotStatus(userId, 0);

        if (ownershipOpt.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        UserTtuBeotOwnership ownership = ownershipOpt.get();

        LocalDateTime createdAt = ownership.getCreatedAt();

        if (createdAt.isAfter(threeDaysAgo)) {
            return ResponseEntity.ok(new TtubeotLogListResponseDTO(Collections.emptyList()));
        }

        List<TtubeotLog> recentLogs = ttubeotLogRepository.findByUserTtuBeotOwnership_User_UserIdAndCreatedAtAfter(
            userId, threeDaysAgo);

        Set<Integer> logTypes = recentLogs.stream()
            .map(TtubeotLog::getTtubeotLogType)
            .collect(Collectors.toSet());

        if (!(logTypes.contains(0) && logTypes.contains(1) && logTypes.contains(2)
            && logTypes.contains(3))) {
            ownership.updateBreakUpAndStatus(now, 2);
            userTtubeotOwnershipRepository.save(ownership);
            return ResponseEntity.ok(new TtubeotLogListResponseDTO(Collections.emptyList()));
        }

        List<TtubeotLog> threeDaysLogs = ttubeotLogRepository.findByUserTtuBeotOwnership_User_UserIdAndCreatedAtBetween(
            userId, threeDaysAgo, now);

        List<TtubeotLogResponseDTO> logsDtos = threeDaysLogs.stream()
            .map(log -> new TtubeotLogResponseDTO(log.getTtubeotLogType(), log.getCreatedAt()))
            .collect(Collectors.toList());

        log.info("뚜벗 상태 확인 완료 - userId: {}, 로그 수: {}", userId, logsDtos.size());

        return ResponseEntity.ok(new TtubeotLogListResponseDTO(logsDtos));
    }

    @Override
    public void registTtubeot(TtubeotRegistToDbDTO ttubeotRegistToDbDTO) {
        log.info("registTtubeot 호출됨 - 데이터: {}", ttubeotRegistToDbDTO);

        Ttubeot ttubeot = Ttubeot.fromDTO(ttubeotRegistToDbDTO);

        ttubeotRepository.save(ttubeot);

        log.info("뚜벗 등록 완료 - ttubeotId: {}", ttubeot.getTtubeotId());
    }

    @Override
    public void registMission(MissionRegistToDbDTO missionRegistDTO) {
        log.info("registMission 호출됨 - 데이터: {}", missionRegistDTO);

        Mission mission = Mission.fromDTO(missionRegistDTO);

        missionRepository.save(mission);

        log.info("미션 등록 완료 - missionId: {}", mission.getMissionId());
    }

    @Override
    public UserTtubeotMissionListResponseDTO getUserDailyMissionList(int userId) {
        log.info("getUserDailyMissionList 호출됨 - userId: {}", userId);

        UserTtuBeotOwnership userTtubeot = findUserTtubeotOwnership(userId);

        List<UserTtubeotMission> inProgressMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 0, MissionStatus.IN_PROGRESS);

        List<UserTtubeotMission> completedMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 0, MissionStatus.COMPLETED);

        List<UserTtubeotMissionResponseDTO> inProgressMissionDTOs = inProgressMissions.stream()
            .map(this::convertToMissionResponseDTO)
            .collect(Collectors.toList());

        List<UserTtubeotMissionResponseDTO> completedMissionDTOs = completedMissions.stream()
            .map(this::convertToMissionResponseDTO)
            .collect(Collectors.toList());

        log.info("일일 미션 조회 완료 - userId: {}, 진행중: {}, 완료: {}",
            userId, inProgressMissionDTOs.size(), completedMissionDTOs.size());

        return new UserTtubeotMissionListResponseDTO(inProgressMissionDTOs, completedMissionDTOs);
    }

    @Override
    public UserTtubeotMissionListResponseDTO getUserWeeklyMissionList(int userId) {
        log.info("getUserWeeklyMissionList 호출됨 - userId: {}", userId);

        UserTtuBeotOwnership userTtubeot = findUserTtubeotOwnership(userId);

        List<UserTtubeotMission> inProgressMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 1, MissionStatus.IN_PROGRESS);

        List<UserTtubeotMission> completedMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 1, MissionStatus.COMPLETED);

        List<UserTtubeotMissionResponseDTO> inProgressMissionDTOs = inProgressMissions.stream()
            .map(this::convertToMissionResponseDTO)
            .collect(Collectors.toList());

        List<UserTtubeotMissionResponseDTO> completedMissionDTOs = completedMissions.stream()
            .map(this::convertToMissionResponseDTO)
            .collect(Collectors.toList());

        log.info("주간 미션 조회 완료 - userId: {}, 진행중: {}, 완료: {}",
            userId, inProgressMissionDTOs.size(), completedMissionDTOs.size());

        return new UserTtubeotMissionListResponseDTO(inProgressMissionDTOs, completedMissionDTOs);
    }

    @Override
    @Transactional
    public MissionRewardResponseDTO requestCoin(int userId,
        MissionRewardRequestDTO missionRewardRequestDTO) {
        log.info("requestCoin 호출됨 - userId: {}, steps: {}", userId,
            missionRewardRequestDTO.getSteps());

        UserTtuBeotOwnership userTtubeot = findUserTtubeotOwnership(userId);

        int steps = missionRewardRequestDTO.getSteps();
        int totalStepsAdded = 0;

        List<UserTtubeotMission> adventureDailyMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionThemeAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 1, 0, MissionStatus.IN_PROGRESS);

        List<UserTtubeotMission> adventureWeeklyMissions = userTtubeotMissionRepository.findByUserTtuBeotOwnershipAndMission_MissionThemeAndMission_MissionTypeAndMissionStatus(
            userTtubeot, 1, 1, MissionStatus.IN_PROGRESS);

        for (UserTtubeotMission mission : adventureDailyMissions) {
            totalStepsAdded += processMission(mission, steps, "일간");
        }

        for (UserTtubeotMission mission : adventureWeeklyMissions) {
            totalStepsAdded += processMission(mission, steps, "주간");
        }

        userTtubeot.accumulateScore(totalStepsAdded);
        userTtubeotOwnershipRepository.save(userTtubeot);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        int coinsToAdd = totalStepsAdded / 5;
        user.addCoins(coinsToAdd);
        userRepository.save(user);

        log.info("걸음수 반영 및 코인 지급 완료 - userId: {}, 추가된 걸음수: {}, 추가된 코인: {}",
            userId, totalStepsAdded, coinsToAdd);

        return new MissionRewardResponseDTO(totalStepsAdded,
            "걸음수가 반영되었습니다. 총 추가 걸음수: " + totalStepsAdded);
    }

    @Override
    public RecentBreakupTtubeotResponseDTO getRecentBreakUpTtubeot(int userId) {
        log.info("getRecentBreakUpTtubeot 호출됨 - userId: {}", userId);

        Optional<UserTtuBeotOwnership> recentBreakup = userTtubeotOwnershipRepository
            .findFirstByUser_UserIdAndBreakUpIsNotNullOrderByBreakUpDesc(userId);

        if (recentBreakup.isEmpty()) {
            log.info("최근에 헤어진 뚜벗이 없음 - userId: {}", userId);
            return null;
        }

        UserTtuBeotOwnership ownership = recentBreakup.get();

        RecentBreakupTtubeotResponseDTO dto = new RecentBreakupTtubeotResponseDTO();
        dto.setTtubeotId(ownership.getTtubeot().getTtubeotId());
        dto.setBreakUp(ownership.getBreakUp());
        dto.setUserTtubeotOwnershipId(ownership.getUserTtubeotOwnershipId());
        dto.setGraduationStatus(ownership.getTtubeotStatus());

        log.info("최근에 헤어진 뚜벗 조회 완료 - userId: {}, ttubeotId: {}",
            userId, ownership.getTtubeot().getTtubeotId());

        return dto;
    }

    @Override
    public UserTtubeotInterestResponseDTO getTtubeotInterest(int userId) {
        log.info("getTtubeotInterest 호출됨 - userId: {}", userId);

        UserTtuBeotOwnership userTtubeotOwnership = findUserTtubeotOwnership(userId);

        int userTtubeotInterest = userTtubeotOwnership.getTtubeotInterest();

        Pageable pageable = PageRequest.of(0, 5);
        List<TtubeotLog> recentLogs = ttubeotLogRepository.findRecentLogsByOwnership(
            userTtubeotOwnership, pageable);

        Map<Integer, Long> logTypeCounts = recentLogs.stream()
            .collect(Collectors.groupingBy(TtubeotLog::getTtubeotLogType, Collectors.counting()));

        long foodCount = logTypeCounts.getOrDefault(0, 0L);
        long socialAndAdventureCount =
            logTypeCounts.getOrDefault(1, 0L) + logTypeCounts.getOrDefault(2, 0L);

        int currentTtubeotStatus;

        if (foodCount >= 2 && socialAndAdventureCount >= 2) {
            currentTtubeotStatus = 2;
        } else if (foodCount < socialAndAdventureCount) {
            currentTtubeotStatus = 0;
        } else {
            currentTtubeotStatus = 1;
        }

        TtubeotLog lastLog = recentLogs.isEmpty() ? null : recentLogs.get(0);
        Integer lastActionType = lastLog != null ? lastLog.getTtubeotLogType() : null;
        LocalDateTime lastActionTime = lastLog != null ? lastLog.getCreatedAt() : null;

        log.info("뚜벗 관심도 조회 완료 - userId: {}, 관심도: {}, 상태: {}", userId, userTtubeotInterest,
            currentTtubeotStatus);

        return new UserTtubeotInterestResponseDTO(userTtubeotInterest, currentTtubeotStatus,
            lastActionType, lastActionTime);
    }

    @Override
    public UserTtubeotGetIdRespDTO findTtubeotIdByOwnershipId(Long ttubeotOwnershipId) {
        log.info("findTtubeotIdByOwnershipId 호출됨 - ttubeotOwnershipId: {}", ttubeotOwnershipId);

        UserTtuBeotOwnership ownership = userTtubeotOwnershipRepository.findById(ttubeotOwnershipId)
            .orElseThrow(() -> new RuntimeException(
                "해당 소유 ID에 대한 TtubeotId를 찾을 수 없습니다: " + ttubeotOwnershipId));

        log.info("뚜벗 ID 조회 완료 - ttubeotOwnershipId: {}, ttubeotId: {}",
            ttubeotOwnershipId, ownership.getTtubeot().getTtubeotId());

        return UserTtubeotGetIdRespDTO.fromEntity(ownership);
    }

    @Override
    public UserTtuBeotOwnership changeTtubeotInterest(Long ttubeotInterestId, Integer mount) {
        log.info("changeTtubeotInterest 호출됨 - ttubeotInterestId: {}, mount: {}", ttubeotInterestId,
            mount);

        UserTtuBeotOwnership userTtuBeotOwnership = userTtubeotOwnershipRepository.findById(
                ttubeotInterestId)
            .orElseThrow(() -> new RuntimeException(
                "해당 ttubeotInterestId에 대한 소유 정보를 찾을 수 없습니다: " + ttubeotInterestId));

        userTtuBeotOwnership.changeInterest(mount);
        userTtubeotOwnershipRepository.save(userTtuBeotOwnership);

        log.info("뚜벗 관심도 변경 완료 - ttubeotInterestId: {}, 새로운 관심도: {}",
            ttubeotInterestId, userTtuBeotOwnership.getTtubeotInterest());

        return userTtuBeotOwnership;
    }

    @Override
    public UserTtuBeotOwnership getUserTtuBeotOwnership(int userId) {
        log.info("getUserTtuBeotOwnership 호출됨 - userId: {}", userId);

        UserTtuBeotOwnership ownership = findUserTtubeotOwnership(userId);

        log.info("뚜벗 소유 정보 조회 완료 - userId: {}, ownershipId: {}",
            userId, ownership.getUserTtubeotOwnershipId());

        return ownership;
    }

    @Override
    @Transactional
    public boolean deleteUserTtuBeotOwnership(Long ttubeotId) {
        log.info("deleteUserTtuBeotOwnership 호출됨 - ttubeotId: {}",
            ttubeotId);

        try {
            UserTtuBeotOwnership userTtuBeotOwnership = userTtubeotOwnershipRepository.findById(
                    ttubeotId)
                .orElseThrow(() -> new IllegalArgumentException(
                    "해당 ID의 소유권이 존재하지 않습니다: " + ttubeotId));

            userTtubeotOwnershipRepository.delete(userTtuBeotOwnership);

            log.info("뚜벗 소유권 삭제 완료 - ttubeotId: {}", ttubeotId);

            return true;
        } catch (Exception e) {
            log.error("삭제 중 오류 발생: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public void verifyAndGraduateAfter7Days() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        for (UserTtuBeotOwnership ttubeot : userTtubeotOwnershipRepository.findAllByStatusAndCreatedAtOlderThanSevenDays(
            0, sevenDaysAgo)) {
            ttubeot.updateBreakUpAndStatus(LocalDateTime.now(), 1);
            userTtubeotOwnershipRepository.save(ttubeot);

            log.info("ID: {} Name: {}가 졸업했습니다.", ttubeot.getUserTtubeotOwnershipId(),
                ttubeot.getTtubeotName());
        }
    }

    // ===================== Private Methods =====================

    private UserTtuBeotOwnership findUserTtubeotOwnership(Integer userId) {
        return userTtubeotOwnershipRepository
            .findByUser_UserIdAndTtubeotStatus(userId, 0)
            .orElseThrow(() -> {
                log.error("정상 상태인 뚜벗을 찾을 수 없음 - userId: {}", userId);
                return new TtubeotNotFoundException("정상 상태인 뚜벗이 존재하지 않습니다.");
            });
    }

    private void checkDailyLimit(Integer logType, UserTtuBeotOwnership ownership) {
        if (logType == 0) {
            LocalDateTime startDate = LocalDate.now().atStartOfDay();
            LocalDateTime endDate = LocalDate.now().atTime(LocalTime.MAX);
            int count = ttubeotLogRepository.countLogsByDateTypeAndId(startDate, endDate, logType,
                ownership.getUserTtubeotOwnershipId());
            if (count >= 10) {
                throw new DailyLimitReachedException("오늘의 밥주기를 모두 완료했어요!");
            }
            log.info("남은 밥주기 횟수: {}", 10 - count);
        }
    }

    private TtubeotLog saveTtubeotLog(Integer logType, UserTtuBeotOwnership ownership) {
        TtubeotLog ttubeotLog = TtubeotLog.builder()
            .ttubeotLogType(logType)
            .createdAt(LocalDateTime.now())
            .userTtuBeotOwnership(ownership)
            .build();
        ttubeotLogRepository.save(ttubeotLog);
        log.info("Ttubeot 로그 저장 완료 - LogType: {}, OwnershipId: {}", ttubeotLog.getTtubeotLogType(),
            ownership.getUserTtubeotOwnershipId());
        return ttubeotLog;
    }

    private int calculateExperienceToAdd(Integer logType) {
        return switch (logType) {
            case 0 -> 1;
            case 1 -> 2;
            case 2 -> 7;
            default -> 0;
        };
    }

    private void updateInterest(UserTtuBeotOwnership ownership, int experienceToAdd) {
        Integer ttubeotInterest = ownership.getTtubeotInterest();
        log.debug("관심 지수 추가 값 계산 - experienceToAdd: {}", experienceToAdd);

        if (ttubeotInterest + experienceToAdd > 100) {
            log.info("관심 지수가 100을 초과하여 추가하지 않음 - 현재 관심 지수: {}", ttubeotInterest);
            return;
        }

        ownership.changeInterest(experienceToAdd);
        userTtubeotOwnershipRepository.save(ownership);

        log.info("관심 지수 업데이트 완료 - 새로운 관심 지수: {}", ownership.getTtubeotInterest());
    }

    private UserTtubeotMissionResponseDTO convertToMissionResponseDTO(UserTtubeotMission mission) {
        return new UserTtubeotMissionResponseDTO(
            mission.getMissionStatus().name(),
            mission.getMission().getMissionTheme(),
            mission.getMission().getMissionType(),
            mission.getMission().getMissionTargetCount(),
            mission.getMission().getMissionName(),
            mission.getMission().getMissionExplanation(),
            mission.getUserTtubeotMissionActionCount()
        );
    }

    private int processMission(UserTtubeotMission userMission, int steps, String missionType) {
        int currentActionCount = userMission.getUserTtubeotMissionActionCount();
        int targetCount = userMission.getMission().getMissionTargetCount();

        log.debug("[{}] 업데이트 전 - Mission ID: {}, 현재 액션 수: {}", missionType,
            userMission.getUserTtubeotMissionId(), currentActionCount);

        userMission.accumulateActionCount(steps);

        if (userMission.getUserTtubeotMissionActionCount() >= targetCount) {
            userMission.completeMission(LocalDateTime.now());
            log.info("[{}] 미션 완료 - Mission ID: {}", missionType,
                userMission.getUserTtubeotMissionId());
        }

        userMission.updateUpdatedAt(LocalDateTime.now());
        userTtubeotMissionRepository.save(userMission);

        log.debug("[{}] 업데이트 후 - Mission ID: {}, 업데이트된 액션 수: {}", missionType,
            userMission.getUserTtubeotMissionId(), userMission.getUserTtubeotMissionActionCount());

        return steps / 2;
    }

    private TtubeotDrawResponseDTO createTtubeotDrawResponseDTO(Integer userId,
        Ttubeot selectedTtubeot) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다."));

        UserTtuBeotOwnership ownership = UserTtuBeotOwnership.builder()
            .user(user)
            .ttubeot(selectedTtubeot)
            .ttubeotName(null)
            .build();
        userTtubeotOwnershipRepository.save(ownership);

        log.info("새로운 뚜벗 소유권 생성 - userId: {}, ownershipId: {}", userId,
            ownership.getUserTtubeotOwnershipId());

        return new TtubeotDrawResponseDTO(ownership.getUserTtubeotOwnershipId(),
            selectedTtubeot.getTtubeotId(), user.getUserCoin());
    }
}
