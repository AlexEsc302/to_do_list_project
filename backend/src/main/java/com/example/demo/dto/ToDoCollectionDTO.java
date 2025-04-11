package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.entities.Priority;

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public void setPriority(Priority priority) { this.priority = priority;}
    public Priority getPriority() { return priority;}

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public LocalDate getDoneDate() { return doneDate; }
    public void setDoneDate(LocalDate doneDate) { this.doneDate = doneDate; }
}
