package com.example.demo.repositories;

import com.example.demo.entities.Priority;
import com.example.demo.models.ToDo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToDoRepository extends JpaRepository<ToDo, Long> {

    Page<ToDo> findByDone(Boolean done, Pageable pageable);

    Page<ToDo> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<ToDo> findByPriority(Priority priority, Pageable pageable);

    Page<ToDo> findByDoneAndNameContainingIgnoreCase(Boolean done, String name, Pageable pageable);

    Page<ToDo> findByDoneAndPriority(Boolean done, Priority priority, Pageable pageable);

    Page<ToDo> findByNameContainingIgnoreCaseAndPriority(String name, Priority priority, Pageable pageable);

    Page<ToDo> findByDoneAndNameContainingIgnoreCaseAndPriority(Boolean done, String name, Priority priority, Pageable pageable);

    List<ToDo> findByDoneTrue();
}