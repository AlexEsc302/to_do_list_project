package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.entities.Priority;

public record ToDoDTO(
    Long id,
    String name,
    String description,
    Priority priority,
    LocalDate dueDate,
    boolean done,
    LocalDateTime createdAt,
    LocalDateTime doneDate
) {}
