package com.user.userttubeot.user.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserUpdateRequestDto {

    @NotNull
    private Byte userLocationAgreement; // 위치정보 제공 동의 (TINYINT에 대응하여 Byte 사용)

    private Integer userParent; // 부모 유저 ID (optional)
}
