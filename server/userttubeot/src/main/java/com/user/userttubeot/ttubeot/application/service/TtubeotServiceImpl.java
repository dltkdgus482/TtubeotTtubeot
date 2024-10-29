package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotDrawResponseDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.TtubeotNameRegisterRequestDTO;
import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import com.user.userttubeot.ttubeot.domain.model.TtubeotLog;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.repository.TtubeotLogRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
import com.user.userttubeot.ttubeot.global.exception.TtubeotNotFoundException;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TtubeotServiceImpl implements TtubeotService {

    private final TtubeotLogRepository ttubeotLogRepository;
    private final UserTtubeotOwnershipRepository userTtubeotOwnershipRepository;

    @Override
    public void addTtubeotLog(int userTtubeotOwnershipId,
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
            .map(UserTtuBeotOwnership::getUserTtubeotOwnershipId)
            .orElseThrow(() -> new TtubeotNotFoundException("보유하고 있는 정상 상태의 뚜벗이 없습니다."));
    }

    // 유저의 뚜벗 상세 정보 조회 -> 정상인 것만.
    @Override
    public UserTtubeotInfoResponseDTO getDdubeotInfo(int userId) {
        UserTtuBeotOwnership userTtuBeotOwnership = userTtubeotOwnershipRepository.findByUserTtubeotOwnershipIdAndTtubeotStatus(
                userId, 0)
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
    public TtubeotDrawResponseDTO drawTtubeot(TtubeotDrawRequestDTO ttubeotDrawRequestDTO) {

        return null;
    }

    @Override
    public void registerTtubeotName(TtubeotNameRegisterRequestDTO ttubeotNameRegisterRequestDTO) {
        Optional<UserTtuBeotOwnership> ownershipOpt = userTtubeotOwnershipRepository.findById(
            ttubeotNameRegisterRequestDTO.getUserTtubeotOwnershipId());

        if (ownershipOpt.isPresent()) {
            UserTtuBeotOwnership ownership = ownershipOpt.get();

            // 새로운 이름을 가진 엔티티 생성
            UserTtuBeotOwnership updatedOwnership = UserTtuBeotOwnership.fromDTO(
                ttubeotNameRegisterRequestDTO,
                ownership.getTtubeot(),
                ownership.getUser()
            );

            // 엔티티 저장
            userTtubeotOwnershipRepository.save(updatedOwnership);

        } else {
            throw new IllegalArgumentException("해당 ID에 해당하는 뚜벗 소유 정보가 없습니다.");
        }

    }
}
