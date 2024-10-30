package com.user.userttubeot.user.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
@NoArgsConstructor
@AllArgsConstructor
public class UserSignupRequestDto {

    @NotBlank(message = "사용자 이름은 필수입니다.")
    private String userName;           // "user_name"

    @NotBlank(message = "전화번호는 필수입니다.")
    @Pattern(regexp = "^\\d{10,11}$", message = "전화번호는 10자에서 11자 사이의 숫자여야 합니다.")
    private String userPhone;          // "user_phone"

    @Size(min = 6, max = 15, message = "비밀번호는 6자에서 15자 사이여야 합니다.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,15}$", message = "비밀번호는 영문과 숫자를 포함해야 합니다.")
    private String userPassword;       // "user_password"

    private int userLocationAgreement; // "user_location_agreement"
    private int userType;              // "user_type"

}
