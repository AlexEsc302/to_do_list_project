package com.example.demo.models;

import com.example.demo.entities.Priority;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "todos")
public class ToDo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 120)
    private Priority priority;

    private LocalDate dueDate;
    private boolean done;
    
    @CreationTimestamp
    @Column(name = "created_date")
    private LocalDateTime createdAt;
    @Column(name = "done_date")
    private LocalDateTime doneDate;

    // Constructor vacío
    public ToDo() {}

    // Constructor con parámetros
    public ToDo(String name, String description, Priority priority, LocalDate dueDate, boolean done, LocalDateTime createdAt ,LocalDateTime doneDate) {
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.done = done;
        this.createdAt = createdAt;
        this.doneDate = doneDate;
    }

    // Getters y Setters
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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getDoneDate() { return doneDate; }
    public void setDoneDate(LocalDateTime doneDate) { this.doneDate = doneDate; }
}
