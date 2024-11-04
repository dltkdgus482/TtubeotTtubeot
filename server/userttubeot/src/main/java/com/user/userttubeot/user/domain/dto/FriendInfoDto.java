package com.user.userttubeot.user.domain.dto;


import com.user.userttubeot.ttubeot.domain.dto.UserTtubeotInfoResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendInfoDto {

    private Integer userId;
    private String username;
    private Integer userWalk;
    private UserTtubeotInfoResponseDTO userTtubeot;
}
