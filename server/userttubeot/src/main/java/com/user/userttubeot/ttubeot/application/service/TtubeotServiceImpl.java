package com.user.userttubeot.ttubeot.application.service;

import com.user.userttubeot.ttubeot.domain.dto.TtubeotLogRequestDTO;
import com.user.userttubeot.ttubeot.domain.model.TtubeotLog;
import com.user.userttubeot.ttubeot.domain.model.UserTtuBeotOwnership;
import com.user.userttubeot.ttubeot.domain.repository.TtubeotLogRepository;
import com.user.userttubeot.ttubeot.domain.repository.UserTtubeotOwnershipRepository;
import java.time.LocalDateTime;
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

    @Override
    public int getTtubeotOwnershipId(int userId) {

        return 0;
    }
}
