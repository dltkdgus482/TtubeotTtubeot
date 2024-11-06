package com.user.userttubeot.ttubeot.domain.dto;

import lombok.Data;

@Data
public class TtubeotNameRegisterRequestDTO {

    @JsonProperty("user_ttubeot_ownership_id")
    private Long userTtubeotOwnershipId;

    @JsonProperty("ttubeot_name")
    private String userTtubeotOwnershipName;

}
