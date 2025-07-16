package com.example.demo.util;

import com.example.demo.entities.Priority;
import com.example.demo.models.ToDo;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TodoBuilder {
    private Long id;
    private String name = "Test Todo";
    private String description = "Test Description";
    private Priority priority = Priority.MEDIUM;
    private LocalDate dueDate = LocalDate.now().plusDays(7);
    private boolean done = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public static TodoBuilder aTodo() {
        return new TodoBuilder();
    }

    public TodoBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public TodoBuilder withName(String name) {
        this.name = name;
        return this;
    }

    public TodoBuilder withDescription(String description) {
        this.description = description;
        return this;
    }

    public TodoBuilder withPriority(Priority priority) {
        this.priority = priority;
        return this;
    }

    public TodoBuilder withDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
        return this;
    }

    public TodoBuilder isDone(boolean done) {
        this.done = done;
        return this;
    }

    public TodoBuilder withCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public ToDo build() {
        ToDo todo = new ToDo();
        todo.setId(id);
        todo.setName(name);
        todo.setDescription(description);
        todo.setPriority(priority);
        todo.setDueDate(dueDate);
        todo.setDone(done);
        todo.setCreatedAt(createdAt);
        return todo;
    }
}
