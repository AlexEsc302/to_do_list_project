package com.example.demo.controllers;

import com.example.demo.dto.ToDoCollectionDTO;
import com.example.demo.dto.ToDoDTO;
import com.example.demo.dto.ToDoInsertData;
import com.example.demo.dto.ToDoModify;
import com.example.demo.entities.Priority;
import com.example.demo.models.ToDo;
import com.example.demo.services.ToDoService;
import com.example.demo.services.ToDoServiceCollections;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/todos")
public class ToDoController {

    private final ToDoService toDoService;
    private final ToDoServiceCollections toDoServiceCollections;

    public ToDoController(ToDoService toDoService, ToDoServiceCollections toDoServiceCollections) {
        this.toDoService = toDoService;
        this.toDoServiceCollections = toDoServiceCollections;
    }

    @GetMapping
    public Page<ToDoDTO> getTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(required = false) Boolean done,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Priority priority) {
        
        return toDoService.getTodos(page, size, sortBy, done, name, priority);
    }

    @PostMapping
    public ResponseEntity<ToDo> createTodo(@Validated @RequestBody ToDoInsertData request) {
        ToDo todo = new ToDo();
        todo.setName(request.getName());
        todo.setDescription(request.getDescription());
        todo.setDueDate(request.getDueDate());
        todo.setPriority(request.getPriority());

        ToDo savedTodo = toDoService.save(todo);
        return new ResponseEntity<>(savedTodo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}") 
    public ResponseEntity<ToDo> updateToDo(@PathVariable Long id, @RequestBody ToDoModify request) { 
        return toDoService.updateToDo(id, request) .map(updated -> new ResponseEntity<>(updated, HttpStatus.OK)) .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); 
    }

    @PostMapping("/{id}/done") 
    public ResponseEntity<ToDo> markTodoAsDone(@PathVariable Long id) { 
        return toDoService.markAsDone(id) .map(todo -> new ResponseEntity<>(todo, HttpStatus.OK)) .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND)); 
    }

    @PutMapping("/{id}/undone")
    public ResponseEntity<ToDo> markTodoAsUndone(@PathVariable Long id) {
        return toDoService.markAsUndone(id) .map(todo -> new ResponseEntity<>(todo, HttpStatus.OK)) .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(toDoService.getMetrics());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToDo(@PathVariable Long id) {
        toDoService.deleteToDo(id);
        return ResponseEntity.noContent().build();
    }

    // Collections
    @GetMapping("/todosC")
    public Page<ToDoCollectionDTO> getFilteredTodos(
            @RequestParam(required = false) Boolean done,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Priority priority,
            Pageable pageable
    ) {
        return toDoServiceCollections.findFilteredTodos(done, name, priority, pageable);
    }

    @PostMapping("/todosC")
    public ToDoCollectionDTO createToDo(@RequestBody ToDoCollectionDTO todo){
        return toDoServiceCollections.create(todo);
    }

    @PutMapping("/todosC/{id}")
    public ToDoCollectionDTO updateToDo(@PathVariable Long id, @RequestBody ToDoCollectionDTO updated) {
        return toDoServiceCollections.update(id, updated);
    }

    @PostMapping("/todosC/{id}/done")
    public void markAsDone(@PathVariable Long id) {
        toDoServiceCollections.markAsDone(id);
    }

    @PutMapping("/todosC/{id}/undone")
    public void markAsUndone(@PathVariable Long id) {
        toDoServiceCollections.markAsUndone(id);
    }
}