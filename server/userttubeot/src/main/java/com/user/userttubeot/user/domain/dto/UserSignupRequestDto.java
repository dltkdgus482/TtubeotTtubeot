package com.user.userttubeot.user.domain.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSignupRequestDto {

    private String userName;           // "user_name"
    private String userPhone;          // "user_phone"
    @Size(min = 6, max = 15, message = "비밀번호는 6자에서 15자 사이여야 합니다.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,15}$", message = "비밀번호는 영문과 숫자를 포함해야 합니다.")
    private String userPassword;       // "user_password"
    private int userLocationAgreement; // "user_location_agreement"
    private int userType;              // "user_type"

}
