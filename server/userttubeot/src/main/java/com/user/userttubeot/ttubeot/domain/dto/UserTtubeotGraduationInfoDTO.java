package com.user.userttubeot.ttubeot.domain.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserTtubeotGraduationInfoDTO {

    private String ttubeotName; // 뚜벗의 이름
    private int ttubeotScore; // 뚜벗 점수
    private LocalDateTime breakUp; // 헤어진 일시
    private LocalDateTime createdAt; // 생성일시
    private int ttubeotId; // 뚜벗의 아이디
    private int ttubeotStatus; // 뚜벗의 상태정보
    private int adventureCount; // 함께한 모험 횟수 -> 로그데이터 접근

}
