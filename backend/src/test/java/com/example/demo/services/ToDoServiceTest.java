package com.example.demo.services;

import com.example.demo.dto.ToDoModify;
import com.example.demo.entities.Priority;
import com.example.demo.models.ToDo;
import com.example.demo.repositories.ToDoRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ToDoServiceTest {
    @InjectMocks
    private ToDoService toDoService;

    @Mock
    private ToDoRepository toDoRepository;

    @BeforeEach
    void setUp() {
        toDoRepository = mock(ToDoRepository.class); 
        toDoService = new ToDoService(toDoRepository); 
    }


    @Test
    void saveToDo_shouldSaveSuccessfully() {
        ToDo todo = new ToDo();
        todo.setName("Test");
        todo.setDescription("Test desc");
        todo.setPriority(Priority.MEDIUM);
        todo.setDueDate(LocalDate.now());
        todo.setDone(false);

        // Aquí nos aseguramos de que el mock devuelva el objeto que estamos guardando.
        when(toDoRepository.save(todo)).thenReturn(todo);

        ToDo saved = toDoService.save(todo);

        assertNotNull(saved);  // Verificar que no es null
        assertEquals("Test", saved.getName());
        verify(toDoRepository, times(1)).save(todo);  // Verificar que se llamó al repositorio una vez
    }


    @Test
    public void testSave() {
        ToDo todo = new ToDo();
        todo.setName("Test Todo");
        todo.setDescription("Test Description");
        todo.setPriority(Priority.HIGH);
        todo.setDueDate(LocalDate.now().plusDays(5));

        // Lo que queremos que devuelva el mock
        ToDo saved = new ToDo();
        saved.setId(1L);
        saved.setName("Test Todo");
        saved.setDescription("Test Description");
        saved.setPriority(Priority.HIGH);
        saved.setDueDate(todo.getDueDate());

        when(toDoRepository.save(any(ToDo.class))).thenReturn(saved);

        ToDo savedTodo = toDoService.save(todo);

        assertNotNull(savedTodo.getId());
        assertEquals("Test Todo", savedTodo.getName());
        assertEquals("Test Description", savedTodo.getDescription());
        assertEquals(Priority.HIGH, savedTodo.getPriority());
        assertEquals(todo.getDueDate(), savedTodo.getDueDate());
    }


    @Test
    public void testUpdateToDo() {
        // Preparar el ToDo original
        ToDo todo = new ToDo();
        todo.setId(1L); // Simulamos que ya tiene un ID (como si viniera de la DB)
        todo.setName("Test Todo");
        todo.setDescription("Test Description");
        todo.setPriority(Priority.LOW);
        todo.setDueDate(LocalDate.now().plusDays(5));

        // Lo que se recibe como datos a actualizar
        ToDoModify updateRequest = new ToDoModify();
        updateRequest.setName("Updated Todo");
        updateRequest.setPriority(Priority.MEDIUM);

        // Simular el comportamiento del repositorio
        when(toDoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(toDoRepository.save(any(ToDo.class))).thenAnswer(invocation -> invocation.getArgument(0));  // Devuelve el mismo objeto modificado

        // Llamar al método que se prueba
        Optional<ToDo> updatedTodo = toDoService.updateToDo(1L, updateRequest);

        // Validaciones
        assertTrue(updatedTodo.isPresent());
        assertEquals("Updated Todo", updatedTodo.get().getName());
        assertEquals(Priority.MEDIUM, updatedTodo.get().getPriority());
    }

    @Test
    public void testMarkAsDone() {
        ToDo todo = new ToDo();
        todo.setId(1L);
        todo.setName("Test Todo");
        todo.setDescription("Test Description");
        todo.setPriority(Priority.HIGH);
        todo.setDueDate(LocalDate.now().plusDays(5));
        todo.setDone(false);
        todo.setCreatedAt(LocalDateTime.now());

        when(toDoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(toDoRepository.save(any(ToDo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<ToDo> updatedTodo = toDoService.markAsDone(1L);

        assertTrue(updatedTodo.isPresent());
        assertTrue(updatedTodo.get().isDone());
        assertNotNull(updatedTodo.get().getDoneDate());
    }


    @Test
    public void testMarkAsUndone() {
        // Crear un ToDo simulado
        ToDo todo = new ToDo();
        todo.setId(1L);  // Simulamos que ya tiene ID
        todo.setName("Test Todo");
        todo.setDescription("Test Description");
        todo.setPriority(Priority.HIGH);
        todo.setDueDate(LocalDate.now().plusDays(5));
        todo.setDone(true);  // Inicialmente marcado como hecho
        todo.setCreatedAt(LocalDateTime.now());
        todo.setDoneDate(LocalDateTime.now());  // También con fecha de done

        // Simular el comportamiento del repositorio
        when(toDoRepository.findById(1L)).thenReturn(Optional.of(todo));
        when(toDoRepository.save(any(ToDo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Ejecutar el método
        Optional<ToDo> updatedTodo = toDoService.markAsUndone(1L);

        // Verificar los resultados
        assertTrue(updatedTodo.isPresent());
        assertFalse(updatedTodo.get().isDone());
        assertNull(updatedTodo.get().getDoneDate());
    }

    @Test
    public void testDeleteToDo() {
        doNothing().when(toDoRepository).deleteById(1L);

        assertDoesNotThrow(() -> toDoService.deleteToDo(1L));
        verify(toDoRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testGetMetrics() {
        // Preparar datos simulados
        ToDo todo1 = new ToDo();
        todo1.setCreatedAt(LocalDateTime.now().minusHours(5));
        todo1.setDoneDate(LocalDateTime.now());
        todo1.setDone(true);
        todo1.setPriority(Priority.HIGH);

        ToDo todo2 = new ToDo();
        todo2.setCreatedAt(LocalDateTime.now().minusHours(2));
        todo2.setDoneDate(LocalDateTime.now());
        todo2.setDone(true);
        todo2.setPriority(Priority.LOW);

        ToDo todo3 = new ToDo();
        todo3.setCreatedAt(LocalDateTime.now().minusHours(4));
        todo3.setDoneDate(LocalDateTime.now());
        todo3.setDone(true);
        todo3.setPriority(Priority.HIGH);

        when(toDoRepository.findByDoneTrue()).thenReturn(List.of(todo1, todo2, todo3));

        // Ejecutar
        Map<String, Object> metrics = toDoService.getMetrics();

        // Validaciones
        assertNotNull(metrics);
        assertTrue(metrics.containsKey("doneCount"));
        assertEquals(3, metrics.get("doneCount"));

        assertTrue(metrics.containsKey("overall"));
        assertTrue(metrics.get("overall") instanceof String);

        assertTrue(metrics.containsKey("byPriority"));
        Map<String, String> byPriority = (Map<String, String>) metrics.get("byPriority");
        assertEquals(3, byPriority.size());
        assertTrue(byPriority.containsKey("HIGH"));
        assertTrue(byPriority.containsKey("LOW"));
        assertTrue(byPriority.containsKey("MEDIUM"));

    }



}
