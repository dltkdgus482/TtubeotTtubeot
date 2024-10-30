package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotNameRegisterRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotGraduationInfoListDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.model.Ttubeot;
import com.user.userttubeot.ttubeot.domain.model.TtubeotLog;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.repository.TtubeotLogRepository;
import com.user.userttubeot.ttubeot.domain.repository.TtubeotRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
import com.user.userttubeot.ttubeot.global.exception.TtubeotNotFoundException;
import com.user.userttubeot.user.domain.entity.User;
import com.user.userttubeot.user.domain.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TtubeotServiceImpl implements TtubeotService {

    private final TtubeotLogRepository ttubeotLogRepository;
    private final UserTtubeotOwnershipRepository userTtubeotOwnershipRepository;
    private final TtubeotRepository TtubeotRepository;
    private final UserRepository userRepository;

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
            .ttubeotType(userTtuBeotOwnership.getTtubeot().getTtubeotType())
            .ttubeotImage(userTtuBeotOwnership.getTtubeot().getTtubeotImage())
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
        Optional<UserTtuBeotOwnership> ownershipOpt = userTtubeotOwnershipRepository.findById(
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
        int graduationStatus = 1;
        // userId와 졸업 상태를 기준으로 소유 뚜벗 목록을 조회
        List<UserTtuBeotOwnership> graduatedTtubeots =
            userTtubeotOwnershipRepository.findByUser_UserIdAndTtubeotStatus(userId,
                graduationStatus);

        // 조회된 entity 목록을 dto로 변환
        List<UserTtubeotGraduationInfoDTO> graduationInfoListDTO = graduatedTtubeots.stream()
            .map(ownership -> {
                UserTtubeotGraduationInfoDTO dto = new UserTtubeotGraduationInfoDTO();
                dto.setTtubeotName(ownership.getTtubeotName());
                dto.setTtubeotScore(ownership.getTtubeotScore());
                dto.setBreakUp(ownership.getBreakUp());
                dto.setCreatedAt(ownership.getCreatedAt());
                dto.setTtubeotId(ownership.getTtubeot().getTtubeotId());
                dto.setTtubeotImage(ownership.getTtubeot().getTtubeotImage());
                return dto;
            })
            .collect(Collectors.toList());

        // DTO리스트를 UserTtubeotInfoListDTO에 담아서
        UserTtubeotGraduationInfoListDTO response = new UserTtubeotGraduationInfoListDTO();
        response.setTtubeotGraduationInfoDTOList(graduationInfoListDTO);

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
            selectedTtubeot.getTtubeotId(), selectedTtubeot.getTtubeotImage());
    }
}
