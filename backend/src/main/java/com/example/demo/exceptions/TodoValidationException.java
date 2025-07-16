package com.example.demo.exceptions;

public class TodoValidationException extends BusinessException {
    public TodoValidationException(String message) {
        super(message, "TODO_VALIDATION_ERROR");
    }
}
