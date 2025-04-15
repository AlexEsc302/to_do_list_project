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
    const [prioritySortDirection, setPrioritySortDirection] = useState<'asc' | 'desc' | null>(null);
    const [dueDateSortDirection, setDueDateSortDirection] = useState<'asc' | 'desc' | null>(null);

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
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
    if (prioritySortDirection === null) {
      setSortBy('priority');
      setPrioritySortDirection('asc');
      setDueDateSortDirection(null);
    } else if (prioritySortDirection === 'asc') {
      setSortBy('priority,desc');
      setPrioritySortDirection('desc');
      setDueDateSortDirection(null);
    } else {
      setSortBy('');
      setPrioritySortDirection(null);
      setDueDateSortDirection(null);
    }
  };

  const handleSortByDueDate = () => {
    if (dueDateSortDirection === null) {
      setSortBy('dueDate');
      setDueDateSortDirection('asc');
      setPrioritySortDirection(null);
    } else if (dueDateSortDirection === 'asc') {
      setSortBy('dueDate,desc');
      setDueDateSortDirection('desc');
      setPrioritySortDirection(null);
    } else {
      setSortBy('');
      setDueDateSortDirection(null);
      setPrioritySortDirection(null);
    }
  };

  const getDueDateColor = (dueDate?: string): string => {
    if (!dueDate) return 'transparent';
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) return '#ffe0e0'; 
    if (diffDays <= 14) return '#fffacd'; 
    return '#e0ffe0'; 
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
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (!confirm) return;
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const getPriorityHeader = () => {
    let indicator = '';
    if (prioritySortDirection === 'asc') {
      indicator = ' ⬆️';
    } else if (prioritySortDirection === 'desc') {
      indicator = ' ⬇️';
    }
    return `Priority${indicator}`;
  };

  const getDueDateHeader = () => {
    let indicator = '';
    if (dueDateSortDirection === 'asc') {
      indicator = ' ⬆️';
    } else if (dueDateSortDirection === 'desc') {
      indicator = ' ⬇️';
    }
    return `Due Date${indicator}`;
  };

  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead style={tableHeaderStyle}>
          <tr>
            <th style={tableHeaderCellStyle}><input type="checkbox" style={checkboxStyle} /></th>
            <th style={tableHeaderCellStyle}>Name</th>
            <th style={{ ...tableHeaderCellStyle, cursor: 'pointer', textAlign: 'center'}} onClick={handleSortByPriority}>
              {getPriorityHeader()}
            </th>
            <th style={{ ...tableHeaderCellStyle, cursor: 'pointer' }} onClick={handleSortByDueDate}>
              {getDueDateHeader()}
            </th>
            <th style={tableHeaderCellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id} style={{ ...tableRowStyle, backgroundColor: getDueDateColor(todo.dueDate || undefined), textAlign: 'center'}}>
              <td style={tableCellStyle}>
                <input type="checkbox" checked={todo.done} onChange={() => handleCheckboxChange(todo)} style={checkboxStyle} />
              </td>

              {editingTodoId === todo.id ? (
                <>
                  <td style={tableCellStyle}>
                    <input
                      type="text"
                      value={editValues.name || ''}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      style={editInputStyle}
                    />
                  </td>
                  <td style={tableCellStyle}>
                    <select
                      value={editValues.priority || 'LOW'}
                      onChange={(e) => setEditValues({ ...editValues, priority: e.target.value as Priority })}
                      style={editSelectStyle}
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </td>
                  <td style={tableCellStyle}>
                    <input
                      type="date"
                      value={editValues.dueDate ?? ''}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          dueDate: e.target.value,
                          dueDatePresent: true,
                        })
                      }
                      style={editInputStyle}
                    />
                    <button onClick={() => setEditValues({ ...editValues, dueDate: null, dueDatePresent: true })} style={editButton}>X</button>
                  </td>
                  <td style={tableCellStyle}>
                    <button onClick={() => saveEdit(todo.id)} style={actionButton}>💾</button>
                    <button onClick={cancelEdit} style={{ ...actionButton, backgroundColor: '#dc3545', marginLeft: '0.5rem' }}>✖️</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ ...tableCellStyle, textDecoration: todo.done ? 'line-through' : 'none', fontWeight: todo.done ? 'normal' : 'bold' }}>{todo.name}</td>
                  <td
                    style={{
                      ...tableCellStyle,
                      textDecoration: todo.done ? 'line-through' : 'none',
                      cursor: 'pointer',
                      fontWeight: todo.done ? 'normal' : 'bold'
                    }}
                  >
                    {todo.priority}
                  </td>
                  <td
                    style={{
                      ...tableCellStyle,
                      textDecoration: todo.done ? 'line-through' : 'none',
                      cursor: 'pointer',
                      fontWeight: todo.done ? 'normal' : 'bold'
                    }}
                  >
                    {todo.dueDate || '-'}
                  </td>

                  <td style={tableCellStyle}>
                    <button onClick={() => startEditing(todo)} style={actionButton}>Edit</button>
                    <button style={{ ...actionButton, backgroundColor: '#dc3545', marginLeft: '0.5rem' }} onClick={() => handleDelete(todo.id)}>Delete</button>
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
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

const tableContainerStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  fontFamily: 'Arial, sans-serif', 
  fontSize: '1rem',
  color: '#333',
};

const tableStyle = {
  width: '100%',
};

const tableHeaderStyle = {
  backgroundColor: '#007bff', 
  color: '#fff',
  fontWeight: 'bold',
};

const tableHeaderCellStyle = {
  padding: '1rem',
  borderBottom: '2px solid #0056b3', 
};

const tableRowStyle = {
  borderBottom: '1px solid #eee',
  transition: 'background-color 0.3s ease',

  '&:hover': {
    backgroundColor: '#f9f9f9',
  },
};

const tableCellStyle = {
  padding: '0.75rem',
};

const checkboxStyle = {
  marginRight: '0.5rem',
};

const actionButton = {
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: '#28a745', 
  color: '#fff',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  fontSize: '0.9rem',

  '&:hover': {
    backgroundColor: '#218838',
  },
};

const editInputStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
  width: '100%',
};

const editSelectStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '0.9rem',
};

const editButton = {
  marginLeft: '0.5rem',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#f44336', 
  color: '#fff',
  cursor: 'pointer',
  fontSize: '0.8rem',
};

export default TodoTable;