package com.user.userttubeot.ttubeot.domain.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TtubeotLogListResponseDTO {

    private List<TtubeotLogResponseDTO> ttubeotLogResponseList;

}
