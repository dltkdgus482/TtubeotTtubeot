package com.user.userttubeot.user.global.util;

import com.vane.badwordfiltering.BadWordFiltering;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NameValidator {

    private final BadWordFiltering badWordFiltering;

    /**
     * 이름 유효성 검사 - 형식 및 비속어 검사 포함
     *
     * @param name 검사할 이름
     */
    public void validate(String name) {
        // 형식 검사 (2~8자의 영문 또는 한글만 허용)
        String nicknamePattern = "^[A-Za-z가-힣]{2,8}$";
        if (!name.matches(nicknamePattern)) {
            log.warn("유효성 검사 실패 - 형식에 맞지 않음: {}", name);
            throw new IllegalArgumentException("영문 또는 한글만으로 2~8자여야 합니다.");
        }

        // 비속어 검사
        if (badWordFiltering.check(name)) {
            log.warn("유효성 검사 실패 - 비속어 포함: {}", name);
            throw new IllegalArgumentException("비속어가 포함되어 있습니다. 다른 닉네임을 입력해주세요.");
        }
    }

}
