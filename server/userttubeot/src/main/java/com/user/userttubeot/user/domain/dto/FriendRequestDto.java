package com.user.userttubeot.user.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FriendRequestDto {

    @JsonProperty("user_id")
    private Integer userId;
    @JsonProperty("friend_id")
    private Integer friendId;

}
