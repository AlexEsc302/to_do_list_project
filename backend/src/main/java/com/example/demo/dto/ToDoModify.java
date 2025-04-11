package com.example.demo.dto;

import java.time.LocalDate;
import com.example.demo.entities.*;

public class ToDoModify {
    private String name;
    private LocalDate dueDate;
    private boolean dueDatePresent;
    private Priority priority;

    // Getters y setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isDueDatePresent() {
        return dueDatePresent;
    }

    public void setDueDatePresent(boolean dueDatePresent) {
        this.dueDatePresent = dueDatePresent;
    }
    
    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}
