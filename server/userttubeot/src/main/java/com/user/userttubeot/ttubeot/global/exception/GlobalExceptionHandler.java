package com.user.userttubeot.ttubeot.global.exception;

import com.user.userttubeot.ttubeot.domain.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(TtubeotNotFoundException.class)
//    public ResponseEntity<ErrorResponseDTO> handleTtubeotNotFoundException(
//        TtubeotNotFoundException e) {
//        ErrorResponseDTO errorResponse = new ErrorResponseDTO("NOT_FOUND", "보유하고 있는 뚜벗이 없습니다.");
//        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
//    }

}
