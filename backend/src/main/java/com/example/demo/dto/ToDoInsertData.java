package com.example.demo.dto;

import java.time.LocalDate;
import com.example.demo.entities.Priority;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ToDoInsertData {
    private String name;
    private String description;
    private Priority priority;
    private LocalDate dueDate;
    private boolean done;
    private LocalDate doneDate;
}
