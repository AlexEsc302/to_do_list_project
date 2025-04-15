package com.example.demo.services;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ToDoCollectionDTO;
import com.example.demo.entities.Priority;
import com.example.demo.repositories.ToDoRepositoryCollections;

import org.springframework.data.domain.Pageable;


@Service
public class ToDoServiceCollections {
    private final ToDoRepositoryCollections todoRepositoryCollections;
    

    public ToDoServiceCollections(ToDoRepositoryCollections todoRepositoryCollections) {
        this.todoRepositoryCollections = todoRepositoryCollections;
    }

    public List<ToDoCollectionDTO> findAll(){
        return todoRepositoryCollections.getAll();
    }

    public Page<ToDoCollectionDTO> findFilteredTodos(Boolean done, String name, Priority priority, Pageable pageable) {
        List<ToDoCollectionDTO> filtered = todoRepositoryCollections.getRawTodos().stream()
            .filter(todo -> done == null || todo.isDone() == done)
            .filter(todo -> name == null || todo.getName().toLowerCase(Locale.ROOT).contains(name.toLowerCase(Locale.ROOT)))
            .filter(todo -> priority == null || Objects.equals(todo.getPriority(), priority))
            .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<ToDoCollectionDTO> pagedList = filtered.subList(start, end);

        return new PageImpl<ToDoCollectionDTO>(pagedList, (org.springframework.data.domain.Pageable) pageable, filtered.size());

    }

    // POST /todos
    public ToDoCollectionDTO create(ToDoCollectionDTO todo) {
        validateToDo(todo);
        return todoRepositoryCollections.addToDo(todo);
    }

    // PUT /todos/{id}
    public ToDoCollectionDTO update(Long id, ToDoCollectionDTO updated) {
        validateUpdate(updated);
        return todoRepositoryCollections.updateToDo(id, updated);
    }

    // POST /todos/{id}/done
    public void markAsDone(Long id) {
        todoRepositoryCollections.markAsDone(id);
    }

    // PUT /todos/{id}/undone
    public void markAsUndone(Long id) {
        todoRepositoryCollections.markUndone(id);
    }


    private void validateToDo(ToDoCollectionDTO todo) {
        if (todo.getName() == null || todo.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (todo.getPriority() == null) {
            throw new IllegalArgumentException("Priority is required");
        }
    }

    private void validateUpdate(ToDoCollectionDTO todo) {
        if (todo.getName() != null && todo.getName().isBlank()) {
            throw new IllegalArgumentException("Name cannot be blank");
        }
    }
    
}
