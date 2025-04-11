import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Priority, ToDo } from '../types/ToDo';
import Pagination from './Pagination';
import { markAsDoneTodo, markAsUnDoneTodo, updateTodo, deleteTodo } from '../api/ToDoApi';

interface Props {
  filters: {
    done?: string;
    name?: string;
    priority?: string;
  };
  refreshKey?: number;
}

const TodoTable: React.FC<Props> = ({ filters }) => {
    const [todos, setTodos] = useState<ToDo[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState<string>('');
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<ToDo> & { dueDatePresent?: boolean }>({});

    useEffect(() => {
        const params = new URLSearchParams();

        // Filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });

        // Pages
        params.append('page', currentPage.toString());
        params.append('size', '10');

        if (sortBy) { 
            params.append('sortBy', sortBy);
        }

        axios
        .get('http://localhost:9090/todos', { params })
        .then((response) => {
            const data = response.data;
            setTodos(data.content);
            setTotalPages(data.totalPages);
        })
        .catch((error) => {
            console.error('Error fetching todos:', error);
        });
    }, [filters, currentPage, sortBy]);

  const handleCheckboxChange = async (todo: ToDo) => {
    try {
        if(todo.done){
            await markAsUnDoneTodo(todo);
            setTodos(todos.map((t) => (t.id === todo.id ? { ...t, done: false } : t)));
        } else {
            await markAsDoneTodo(todo);
        setTodos(todos.map((t) => (t.id === todo.id ? { ...t, done: true } : t)));
        }
        
    } catch (error) {
        console.error('Error toggling todo done status:', error);
    }
  };

  const handleSortByPriority = () => { 
    setSortBy((prev) => (prev === 'priority_dueDate' ? '' : 'priority_dueDate')); 
  };

  const handleSortByDueDate = () => { 
    setSortBy((prev) => (prev === 'dueDate_priority' ? '' : 'dueDate_priority')); 
  };

  const getDueDateColor = (dueDate?: string): string => {
    if (!dueDate) return 'transparent';
  
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays <= 7) return 'lightcoral';      
    if (diffDays <= 14) return 'khaki';          
    return 'lightgreen';                        
  };
  

  const startEditing = (todo: ToDo) => {
    setEditingTodoId(todo.id);
    setEditValues({
      name: todo.name,
      priority: todo.priority,
      dueDate: todo.dueDate ? todo.dueDate : undefined
    });
  };  

  const saveEdit = async (id: number) => {
    try {
      const updated = { ...editValues, id };
      const updatedTodo = await updateTodo(updated);
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      setEditingTodoId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditValues({});
  };
  
  const handleDelete = async (id: number) => {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?');
    if (!confirm) return;
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
        <thead style={{backgroundColor: 'darkcyan', color: 'white'}}>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Name</th>
            <th style={{ cursor: 'pointer' }} onClick={handleSortByPriority}> Priority {sortBy === 'priority_dueDate' } </th> 
            <th style={{ cursor: 'pointer' }} onClick={handleSortByDueDate}> Due Date {sortBy === 'dueDate_priority' } </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id} style={{ borderTop: '1px solid #ccc', backgroundColor: getDueDateColor(todo.dueDate || '-') }}>          
              <td>
              <input type="checkbox" checked={todo.done} onChange={() => handleCheckboxChange(todo)}/>
              </td>

                {editingTodoId === todo.id ? (
                    <>
                        <td>
                        <input
                            type="text"
                            value={editValues.name || ''}
                            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                        />
                        </td>
                        <td>
                        <select
                            value={editValues.priority || 'LOW'}
                            onChange={(e) => setEditValues({ ...editValues, priority: e.target.value as Priority })}
                        >
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                        </select>
                        </td>
                        <td>
                        <input
                        type="date"
                        value={editValues.dueDate ?? ''}
                        onChange={(e) =>
                            setEditValues({
                            ...editValues,
                            dueDate: e.target.value,
                            dueDatePresent: true
                            })
                        }
                        />
                        <button onClick={() => setEditValues({ ...editValues, dueDate: null,dueDatePresent: true})}>X</button>
                        </td>
                        <td>
                            <button onClick={() => saveEdit(todo.id)}>💾</button>
                            <button onClick={cancelEdit} style={{ marginLeft: '0.5rem' }}>✖️</button>
                        </td>
                        </>
                        ) : (
                        <>
                        <td style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.name}</td>
                        <td
                            style={{
                                textDecoration: todo.done ? 'line-through' : 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {todo.priority}
                        </td>
                        <td
                            style={{
                                textDecoration: todo.done ? 'line-through' : 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {todo.dueDate || '-'}
                        </td>

                        <td>
                        <button onClick={() => startEditing(todo)}>Edit</button>
                        <button style={{ marginLeft: '0.5rem' }} onClick={() => handleDelete(todo.id)}>Delete</button>
                        </td>
                    </>
                )}

            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default TodoTable;
