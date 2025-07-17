import api from './apiConfig';
import { ToDo, ToDoCreate, ToDoUpdate, TodoPage, TodoMetrics, TodoFilters } from '../types/ToDo';

export const TodoApi = {
  fetchTodos: async (filters: TodoFilters): Promise<TodoPage> => {
    const params = new URLSearchParams();
    if (filters.done !== undefined) params.append('done', String(filters.done));
    if (filters.name) params.append('name', filters.name);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    
    return await api.get(`/todos?${params.toString()}`);
  },

  createTodo: async (todo: ToDoCreate): Promise<ToDo> => {
    return await api.post('/todos', todo);
  },

  updateTodo: async (id: number, todo: ToDoUpdate): Promise<ToDo> => {
    return await api.put(`/todos/${id}`, todo);
  },

  markAsDone: async (id: number): Promise<ToDo> => {
    return await api.post(`/todos/${id}/done`);
  },

  markAsUndone: async (id: number): Promise<ToDo> => {
    return await api.put(`/todos/${id}/undone`);
  },

  fetchMetrics: async (): Promise<TodoMetrics> => {
    return await api.get('/todos/metrics');
  },

  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
  }
};
