package com.example.demo.dto;

import java.time.LocalDate;
import com.example.demo.entities.Priority;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ToDoModify {
    private String name;
    private LocalDate dueDate;
    private boolean dueDatePresent;
    private Priority priority;
}
