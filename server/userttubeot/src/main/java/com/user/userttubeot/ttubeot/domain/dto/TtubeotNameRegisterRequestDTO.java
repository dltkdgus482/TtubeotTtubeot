package com.user.userttubeot.ttubeot.domain.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class TtubeotNameRegisterRequestDTO {

    @JsonProperty("userTtubeotOwnershipId")
    private Long userTtubeotOwnershipId;

    @JsonProperty("userTtubeotOwnershipName")
    private String userTtubeotOwnershipName;


}
