package com.example.demo.dto;

import java.time.LocalDate;
import com.example.demo.entities.Priority;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
public class ToDoInsertData {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @Size(max = 255, message = "Description must be at most 255 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private LocalDate dueDate;
    private boolean done;
    private LocalDate doneDate;
}
