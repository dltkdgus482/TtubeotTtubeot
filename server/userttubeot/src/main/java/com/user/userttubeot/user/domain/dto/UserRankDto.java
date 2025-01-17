package com.user.userttubeot.user.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRankDto {

    private Integer userId;
    private String username;
    private Integer score;
    private Integer ttubeotId;
}
