package com.user.userttubeot.user.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckFriendDto {

    private Integer userId;
    private Integer friendId;

}
