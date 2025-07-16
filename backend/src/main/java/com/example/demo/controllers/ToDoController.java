package com.example.demo.controllers;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ToDoDTO;
import com.example.demo.dto.ToDoInsertData;
import com.example.demo.dto.ToDoModify;
import com.example.demo.entities.Priority;
import com.example.demo.exceptions.TodoNotFoundException;
import com.example.demo.models.ToDo;
import com.example.demo.services.ToDoService;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/todos")
public class ToDoController {

    private final ToDoService toDoService;

    public ToDoController(ToDoService toDoService) {
        this.toDoService = toDoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ToDoDTO>>> getTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(required = false) Boolean done,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Priority priority) {
        
        Page<ToDoDTO> todos = toDoService.getTodos(page, size, sortBy, done, name, priority);
        return ResponseEntity.ok(ApiResponse.success(todos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ToDo>> createTodo(@Validated @RequestBody ToDoInsertData request) {
        ToDo todo = new ToDo();
        todo.setName(request.getName());
        todo.setDescription(request.getDescription());
        todo.setDueDate(request.getDueDate());
        todo.setPriority(request.getPriority());

        ToDo savedTodo = toDoService.save(todo);
        return new ResponseEntity<>(ApiResponse.success(savedTodo), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ToDo>> updateToDo(@PathVariable Long id, @Validated @RequestBody ToDoModify request) {
        ToDo updated = toDoService.updateToDo(id, request)
            .orElseThrow(() -> new TodoNotFoundException(id));
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PostMapping("/{id}/done")
    public ResponseEntity<ApiResponse<ToDo>> markTodoAsDone(@PathVariable Long id) {
        ToDo todo = toDoService.markAsDone(id)
            .orElseThrow(() -> new TodoNotFoundException(id));
        return ResponseEntity.ok(ApiResponse.success(todo));
    }

    @PutMapping("/{id}/undone")
    public ResponseEntity<ApiResponse<ToDo>> markTodoAsUndone(@PathVariable Long id) {
        ToDo todo = toDoService.markAsUndone(id)
            .orElseThrow(() -> new TodoNotFoundException(id));
        return ResponseEntity.ok(ApiResponse.success(todo));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.success(toDoService.getMetrics()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToDo(@PathVariable Long id) {
        toDoService.deleteToDo(id);
        return ResponseEntity.noContent().build();
    }


}