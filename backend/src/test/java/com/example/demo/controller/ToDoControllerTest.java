package com.example.demo.controller;

import com.example.demo.controllers.ToDoController;
import com.example.demo.dto.ToDoDTO;
import com.example.demo.entities.Priority;
import com.example.demo.models.ToDo;
import com.example.demo.services.ToDoService;
import com.example.demo.services.ToDoServiceCollections;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ToDoController.class)
public class ToDoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ToDoService toDoService;

    @MockitoBean
    private ToDoServiceCollections toDoServiceCollections;

    @Test
    void testGetTodosReturnsPageOfTodos() throws Exception {
        ToDoDTO sampleTodo = new ToDoDTO(1L, "Test", "description", Priority.HIGH, null, false, null, null);
        PageImpl<ToDoDTO> page = new PageImpl<>(List.of(sampleTodo));

        Mockito.when(toDoService.getTodos(anyInt(), anyInt(), anyString(), Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(page);

        mockMvc.perform(get("/todos")
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "dueDate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Test"));
    }

    @Test 
    void testCreateTodoReturnsCreatedTodo() throws Exception { 
        ToDo todoToSave = new ToDo(); 
        todoToSave.setName("New Task"); 
        todoToSave.setDescription("Description"); 
        todoToSave.setPriority(Priority.MEDIUM);

        ToDo savedTodo = new ToDo();
        savedTodo.setId(1L);
        savedTodo.setName("New Task");
        savedTodo.setDescription("Description");
        savedTodo.setPriority(Priority.MEDIUM);

        Mockito.when(toDoService.save(Mockito.any(ToDo.class))).thenReturn(savedTodo);

        String requestBody = """
            {
            "name": "New Task",
            "description": "Description",
            "priority": "MEDIUM"
            }
        """;

        mockMvc.perform(
                post("/todos")
                        .contentType("application/json")
                        .content(requestBody)
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.name").value("New Task"))
            .andExpect(jsonPath("$.priority").value("MEDIUM"));

    }

    @Test 
    void testUpdateTodoReturnsUpdatedTodo() throws Exception { 
        Long id = 1L; 
        ToDo updated = new ToDo(); 
        updated.setId(id); 
        updated.setName("Updated Name"); 
        updated.setPriority(Priority.HIGH);

        Mockito.when(toDoService.updateToDo(Mockito.eq(id), Mockito.any())).thenReturn(java.util.Optional.of(updated));

        String requestBody = """
            {
            "name": "Updated Name",
            "priority": "HIGH"
            }
        """;

        mockMvc.perform(
                put("/todos/{id}", id)
                    .contentType("application/json")
                    .content(requestBody)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.name").value("Updated Name"))
            .andExpect(jsonPath("$.priority").value("HIGH"));
    }

    @Test 
    void testUpdateTodoReturnsNotFound() throws Exception { 
        Long id = 99L;
        Mockito.when(toDoService.updateToDo(Mockito.eq(id), Mockito.any())).thenReturn(java.util.Optional.empty());

        String requestBody = """
            {
            "name": "Doesn't matter"
            }
        """;

        mockMvc.perform(
                put("/todos/{id}", id)
                    .contentType("application/json")
                    .content(requestBody)
            )
            .andExpect(status().isNotFound());
    }

    @Test 
    void testMarkTodoAsDoneReturnsUpdatedTodo() throws Exception { 
        Long id = 1L; 
        ToDo newToDo = new ToDo(); 
        newToDo.setId(id); 
        newToDo.setName("Complete ToDo");
        newToDo.setDone(true); 
        newToDo.setPriority(Priority.LOW);

        Mockito.when(toDoService.markAsDone(id)).thenReturn(java.util.Optional.of(newToDo));

        mockMvc.perform(post("/todos/{id}/done", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.done").value(true));
    }

    @Test 
    void testMarkTodoAsUndoneReturnsUpdatedTodo() throws Exception { 
        Long id = 1L; 
        ToDo unDoneToDo = new ToDo(); 
        unDoneToDo.setId(id); 
        unDoneToDo.setName("Complete ToDo");
        unDoneToDo.setDone(false); 
        unDoneToDo.setPriority(Priority.LOW);
        
        Mockito.when(toDoService.markAsUndone(id)).thenReturn(java.util.Optional.of(unDoneToDo));

        mockMvc.perform(put("/todos/{id}/undone", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.done").value(false));
    }

    @Test
    void testDeleteTodoReturnsNoContent() throws Exception{
        Long id = 1L;
        
        Mockito.doNothing().when(toDoService).deleteToDo(id);

        mockMvc.perform(delete("/todos/{id}", id))
            .andExpect(status().isNoContent());
    }

    @Test 
    void testGetMetricsReturnsOkWithCorrectData() throws Exception { 
        Map<String, Object> metrics = Map.of( "overall", "01:30", "doneCount", 5, "byPriority", Map.of("LOW", "00:45", "MEDIUM", "01:15", "HIGH", "02:00") );
        
        Mockito.when(toDoService.getMetrics()).thenReturn(metrics);

        mockMvc.perform(get("/todos/metrics"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.overall").value("01:30"))
            .andExpect(jsonPath("$.doneCount").value(5))
            .andExpect(jsonPath("$.byPriority.LOW").value("00:45"))
            .andExpect(jsonPath("$.byPriority.MEDIUM").value("01:15"))
            .andExpect(jsonPath("$.byPriority.HIGH").value("02:00"));

    }
}
