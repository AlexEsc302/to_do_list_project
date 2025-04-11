package com.example.demo.services;

import com.example.demo.dto.ToDoDTO;
import com.example.demo.dto.ToDoModify;
import com.example.demo.entities.Priority;
import com.example.demo.models.ToDo;
import com.example.demo.repositories.ToDoRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ToDoService {

    private final ToDoRepository todoRepository;

    public ToDoService(ToDoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public Page<ToDoDTO> getTodos(int page, int size, String sortBy, Boolean done, String name, Priority priority) {
        
        Sort sort;

        if ("dueDate_priority".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Order.asc("dueDate"), Sort.Order.asc("priority"));
        } else if ("priority_dueDate".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Order.asc("priority"), Sort.Order.asc("dueDate"));
        } else {
            sort = Sort.by(Sort.Order.asc(sortBy));
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ToDo> todos;

        if (done != null && name != null && priority != null) {
            todos = todoRepository.findByDoneAndNameContainingIgnoreCaseAndPriority(done, name, priority, pageable);
        } else if (done != null && name != null) {
            todos = todoRepository.findByDoneAndNameContainingIgnoreCase(done, name, pageable);
        } else if (done != null && priority != null) {
            todos = todoRepository.findByDoneAndPriority(done, priority, pageable);
        } else if (name != null && priority != null) {
            todos = todoRepository.findByNameContainingIgnoreCaseAndPriority(name, priority, pageable);
        } else if (done != null) {
            todos = todoRepository.findByDone(done, pageable);
        } else if (name != null) {
            todos = todoRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (priority != null) {
            todos = todoRepository.findByPriority(priority, pageable);
        } else {
            todos = todoRepository.findAll(pageable);
        }

        return todos.map(todo -> new ToDoDTO(
                todo.getId(),
                todo.getName(),
                todo.getDescription(),
                todo.getPriority(),
                todo.getDueDate(),
                todo.isDone(),
                todo.getCreatedAt(),
                todo.getDoneDate()
        ));

    }

    public ToDo save(ToDo todo) { return todoRepository.save(todo); }   

    public Optional<ToDo> updateToDo(Long id, ToDoModify request) { 
        Optional<ToDo> optionalToDo = todoRepository.findById(id);

        if (optionalToDo.isEmpty()) {
            return Optional.empty();
        }
        
        ToDo todo = optionalToDo.get();
        
        if (request.getName() != null) {
            todo.setName(request.getName());
        }
        
        if (request.isDueDatePresent()) {
            todo.setDueDate(request.getDueDate());
        }
        
        if (request.getPriority() != null) {
            todo.setPriority(request.getPriority());
        }
        
        todoRepository.save(todo);
        
        return Optional.of(todo);
    }

    public Optional<ToDo> markAsDone(Long id) { 
        Optional<ToDo> optionalToDo = todoRepository.findById(id);
        if (optionalToDo.isEmpty()) {
            return Optional.empty();
        }

        ToDo todo = optionalToDo.get();

        if (!todo.isDone()) {
            todo.setDone(true);
            todo.setDoneDate(LocalDateTime.now());
            todoRepository.save(todo);
        }

        return Optional.of(todo);
    }

    public Optional<ToDo> markAsUndone(Long id) {
        Optional<ToDo> optionalToDo = todoRepository.findById(id);
        if (optionalToDo.isEmpty()) {
            return Optional.empty();
        }

        ToDo todo = optionalToDo.get();

        if (todo.isDone()) {
            todo.setDone(false);
            todo.setDoneDate(null);
            todoRepository.save(todo);
        }

        return Optional.of(todo);
    }

    public Map<String, Object> getMetrics() {
        List<ToDo> doneTodos = todoRepository.findByDoneTrue();

        long totalMinutes = 0;
        int count = 0;

        Map<Priority, List<Long>> timeByPriority = new HashMap<>();
        for (Priority p : Priority.values()) {
            timeByPriority.put(p, new ArrayList<>());
        }

        for (ToDo todo : doneTodos) {
            LocalDateTime created = todo.getCreatedAt();
            LocalDateTime doneDate = todo.getDoneDate();

            if (created != null && doneDate != null) {
                Duration duration = Duration.between(created, doneDate);
                long minutes = duration.toMinutes();
                totalMinutes += minutes;
                count++;
                timeByPriority.get(todo.getPriority()).add(minutes);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("overall", averageTimeString(totalMinutes, count));
        result.put("doneCount", count);

        Map<String, String> byPriority = new HashMap<>();
        for (Priority p : Priority.values()) {
            List<Long> list = timeByPriority.get(p);
            long sum = list.stream().mapToLong(Long::longValue).sum();
            int size = list.size();
            byPriority.put(p.name(), averageTimeString(sum, size));
        }

        result.put("byPriority", byPriority);
        return result;
    }

    private String averageTimeString(long totalMinutes, int count) {
        if (count == 0) return "00:00";
        long avg = totalMinutes / count;
        long hours = avg / 60;
        long minutes = avg % 60;
        return String.format("%02d:%02d", hours, minutes);
    }

    public void deleteToDo(Long id) {
        todoRepository.deleteById(id);
    }
    
}
