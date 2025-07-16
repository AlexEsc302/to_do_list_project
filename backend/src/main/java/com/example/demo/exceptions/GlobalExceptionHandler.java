package com.example.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.example.demo.dto.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TodoNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleTodoNotFoundException(TodoNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ApiResponse.error(ex.getMessage(), "TODO_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TodoValidationException.class)
    public ResponseEntity<ApiResponse<Object>> handleTodoValidationException(TodoValidationException ex, WebRequest request) {
        return new ResponseEntity<>(ApiResponse.error(ex.getMessage(), "VALIDATION_ERROR"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusinessException(BusinessException ex, WebRequest request) {
        return new ResponseEntity<>(ApiResponse.error(ex.getMessage(), "BUSINESS_ERROR"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAllUncaughtException(Exception ex, WebRequest request) {
        return new ResponseEntity<>(ApiResponse.error("An unexpected error occurred", "INTERNAL_ERROR"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
