package com.user.userttubeot.ttubeot.domain.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TtubeotLogListResponseDTO {

    private List<TtubeotLogResponseDTO> ttubeotLogResponseList;

}
