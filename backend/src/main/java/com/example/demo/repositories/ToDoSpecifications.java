package com.example.demo.repositories;

import com.example.demo.entities.Priority;
import com.example.demo.models.ToDo;
import org.springframework.data.jpa.domain.Specification;

public class ToDoSpecifications {
    
    public static Specification<ToDo> hasPriority(Priority priority) {
        return (root, query, criteriaBuilder) -> {
            if (priority == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("priority"), priority);
        };
    }

    public static Specification<ToDo> isDone(Boolean done) {
        return (root, query, criteriaBuilder) -> {
            if (done == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("done"), done);
        };
    }

    public static Specification<ToDo> nameContains(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get("name")),
                "%" + name.toLowerCase() + "%"
            );
        };
    }
}
