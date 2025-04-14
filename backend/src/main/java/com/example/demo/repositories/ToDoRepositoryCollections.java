package com.example.demo.repositories;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.demo.dto.ToDoCollectionDTO;
import com.example.demo.entities.Priority;


@Repository
public class ToDoRepositoryCollections {
    private Map<Long, ToDoCollectionDTO> toDos = new HashMap<>();
    private long currentId = 3;

    public ToDoRepositoryCollections(){
        toDos.put(1L,new ToDoCollectionDTO(
            1,
            "To Do 1",
            "To Do 1 description",
            Priority.LOW,
            null,
            false,
            null
        ));
      
        toDos.put(2L, new ToDoCollectionDTO(
            2,
            "To Do 2",
            "To Do 2 description",
            Priority.LOW,
            null,
            false,
            null
        ));
    }
    public List<ToDoCollectionDTO> getAll(){
        return new ArrayList<>(toDos.values());
    }

    public ToDoCollectionDTO addToDo(ToDoCollectionDTO toDo){
        toDo.setId(currentId++);
        toDos.put(toDo.getId(),toDo);
        return toDo;
    }

    public ToDoCollectionDTO updateToDo(Long id, ToDoCollectionDTO toDo){
        ToDoCollectionDTO alreadyExist = toDos.get(id);
        if(alreadyExist != null)  {
            if (toDo.getName() != null) alreadyExist.setName(toDo.getName());
            if (toDo.getDueDate() != null) alreadyExist.setDueDate(toDo.getDueDate());
            if (toDo.getPriority() != null) alreadyExist.setPriority(toDo.getPriority());
        }
        return alreadyExist;
    }

    public void markAsDone(Long id){
        ToDoCollectionDTO todo = toDos.get(id);
        if (todo != null && !todo.isDone()) {
            todo.setDone(true);
            todo.setDoneDate(LocalDate.now());
        }
    }
    public void markUndone(Long id) {
        ToDoCollectionDTO todo = toDos.get(id);
        if (todo != null && todo.isDone()) {
            todo.setDone(false);
            todo.setDoneDate(null);
        }
    }
    public Collection<ToDoCollectionDTO> getRawTodos() {
        return toDos.values();
    }
    public ToDoCollectionDTO getToDo(Long id) {
        return toDos.get(id);
    }
}
