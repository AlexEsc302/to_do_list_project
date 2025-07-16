package com.example.demo.exceptions;

public class TodoNotFoundException extends BusinessException {
    public TodoNotFoundException(Long id) {
        super(String.format("Todo with id %d not found", id), "TODO_NOT_FOUND");
    }
}
