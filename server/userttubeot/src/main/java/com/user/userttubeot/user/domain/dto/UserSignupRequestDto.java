package com.user.userttubeot.user.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSignupRequestDto {

    private String userName;           // "user_name"
    private String userPhone;          // "user_phone"
    private String userPassword;       // "user_password"
    private int userLocationAgreement; // "user_location_agreement"
    private int userType;              // "user_type"

}
