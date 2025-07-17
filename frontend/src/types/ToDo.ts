export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ToDo {
  id: number;
  name: string;
  description?: string;
  priority: Priority;
  dueDate: string | null;
  done: boolean;
  doneDate: string | null;
  createdDate?: string;
}

export interface ToDoCreate {
  name: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
}

export interface ToDoUpdate {
  name?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface TodoPage {
  content: ToDo[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface TodoMetrics {
  overall: string;
  doneCount: number;
  byPriority: Record<Priority, string>;
}

export interface TodoFilters {
  done?: boolean;
  name?: string;
  priority?: Priority;
  page?: number;
  size?: number;
  sortBy?: string;
}

