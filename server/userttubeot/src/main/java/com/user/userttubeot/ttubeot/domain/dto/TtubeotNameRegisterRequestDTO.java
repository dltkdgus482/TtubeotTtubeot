package com.user.userttubeot.ttubeot.domain.dto;

import lombok.Data;

@Data
public class TtubeotNameRegisterRequestDTO {

    @JsonProperty("userTtubeotOwnershipId")
    private Long userTtubeotOwnershipId;

    @JsonProperty("userTtubeotOwnershipName")
    private String userTtubeotOwnershipName;

}
