package com.user.userttubeot.ttubeot.domain.dto;

import lombok.Data;

@Data
public class TtubeotDrawResponseDTO {

    private Integer userTtubeotOwnershipId; // 회원의 뚜벗 아이디 -> 추후 이름 등록할때 request로 필요
    private Integer ttubeotId; // 뽑은 뚜벗의 아이디

}
