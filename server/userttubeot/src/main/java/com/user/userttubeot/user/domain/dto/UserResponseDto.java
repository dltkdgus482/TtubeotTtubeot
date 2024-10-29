package com.user.userttubeot.user.domain.dto;

import com.user.userttubeot.user.domain.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserResponseDto {

    private String userName;
    private String userPhone;
    private Boolean userLocationAgreement;
    private Integer userGoal;
    private Integer userCoin;
    private Integer userParent;

    // User 엔티티를 UserResponseDto로 변환하는 메서드
    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
            .userName(user.getUserName())
            .userPhone(user.getUserPhone())
            .userLocationAgreement(user.getUserLocationAgreement())
            .userGoal(user.getUserGoal())
            .userCoin(user.getUserCoin())
            .userParent(user.getUserParent())
            .build();
    }
}
