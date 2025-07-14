package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.entities.Priority;

import lombok.Data;

@Data
public class ToDoCollectionDTO {
    private Long id;
    private String name;
    private String description;
    private Priority priority;
    private LocalDate dueDate;
    private boolean done;
    private LocalDate doneDate;

    public ToDoCollectionDTO(){}
    
    public ToDoCollectionDTO(long id, String name, String description, Priority priority, LocalDate dueDate, boolean done, LocalDate doneDate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.done = done;
        this.doneDate = doneDate;
    }
}
