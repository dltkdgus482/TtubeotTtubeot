package com.user.userttubeot.user.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FriendRequestDto {

    private Integer userId;
    private Integer friendId;

}
