import React, { useEffect, useState } from 'react';
import { Priority, ToDo, TodoFilters } from '../types/ToDo';
import Pagination from './Pagination';
import { TodoApi } from '../api/ToDoApi';
import TodoCard from './TodoCard';

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prioritySortDirection, setPrioritySortDirection] = useState<'asc' | 'desc' | null>(null);
    const [dueDateSortDirection, setDueDateSortDirection] = useState<'asc' | 'desc' | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const todoFilters: TodoFilters = {
                    done: filters.done ? filters.done === 'true' : undefined,
                    name: filters.name,
                    priority: filters.priority as Priority | undefined,
                    page: currentPage,
                    size: 10,
                    sortBy
                };

                const result = await TodoApi.fetchTodos(todoFilters);
                setTodos(result.content);
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error('Error fetching todos:', error);
                setError('Failed to load todos. Please try again.');
                setTodos([]);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [filters, currentPage, sortBy]);

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

  const handleUpdateTodo = (updatedTodo: ToDo) => {
    setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await TodoApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Error will be shown via toast from the API interceptor
    }
  };

  const getSortButtons = () => {
    return (
      <div className="d-flex align-items-center mb-3">
        <div className="me-3">
          <span className="text-muted me-2">Sort by:</span>
        </div>
        <button 
          className={`btn btn-sm ${prioritySortDirection ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={handleSortByPriority}
        >
          Priority {prioritySortDirection === 'asc' ? '↑' : prioritySortDirection === 'desc' ? '↓' : ''}
        </button>
        <button 
          className={`btn btn-sm ${dueDateSortDirection ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={handleSortByDueDate}
        >
          Due Date {dueDateSortDirection === 'asc' ? '↑' : dueDateSortDirection === 'desc' ? '↓' : ''}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-light rounded-lg shadow-sm p-3">
      {getSortButtons()}
      
      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading todos...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center my-5 py-5">
          <div className="mb-3">📝</div>
          <h5>No todos found</h5>
          <p className="text-muted">Try changing your filters or add a new todo.</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map(todo => (
            <div className="todo-card-container mb-3" key={todo.id}>
              <TodoCard 
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default TodoTable;