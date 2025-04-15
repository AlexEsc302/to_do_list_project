package com.example.demo.controller;

import com.example.demo.controllers.ToDoController;
import com.example.demo.dto.ToDoDTO;
import com.example.demo.entities.Priority;
import com.example.demo.services.ToDoService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;


import org.springframework.data.domain.PageImpl;


import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ToDoController.class)
public class ToDoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ToDoService toDoService;

    //private ToDoServiceCollections toDoServiceCollections;

    @Test
    void testGetTodosReturnsPageOfTodos() throws Exception {
        ToDoDTO sampleTodo = new ToDoDTO(1L, "Test", "description", Priority.HIGH, null, false, null,null);
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
}
