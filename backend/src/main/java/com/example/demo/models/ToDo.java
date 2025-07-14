package com.example.demo.models;

import com.example.demo.entities.Priority;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
