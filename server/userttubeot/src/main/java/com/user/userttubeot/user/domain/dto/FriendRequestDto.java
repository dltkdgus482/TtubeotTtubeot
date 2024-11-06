package com.user.userttubeot.user.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FriendRequestDto {

    @JsonProperty("userId")
    private Integer userId;
    @JsonProperty("friendId")
    private Integer friendId;

}
