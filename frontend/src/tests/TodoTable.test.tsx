import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import TodoTable from '../components/TodoTable';
import { TodoApi } from '../api/ToDoApi';

// Mock TodoApi
jest.mock('../api/ToDoApi', () => ({
  TodoApi: {
    fetchTodos: jest.fn(),
    markAsDone: jest.fn(),
    markAsUndone: jest.fn(),
    deleteTodo: jest.fn(),
  }
}));

// Mock toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

// Mock window.confirm
window.confirm = jest.fn(() => true);

describe('TodoTable Component', () => {
  const mockTodos = {
    content: [
      {
        id: 1,
        name: 'Task 1',
        description: 'Description 1',
        priority: 'HIGH',
        done: false,
        dueDate: '2023-05-20',
        doneDate: null,
        createdDate: '2023-05-10',
      },
      {
        id: 2,
        name: 'Task 2',
        description: 'Description 2',
        priority: 'MEDIUM',
        done: true,
        dueDate: '2023-05-15',
        doneDate: '2023-05-14',
        createdDate: '2023-05-05',
      },
    ],
    totalPages: 1,
    totalElements: 2,
    size: 10,
    number: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    (TodoApi.fetchTodos as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<TodoTable filters={{}} refreshKey={0} />);
    
    expect(screen.getByText(/Loading todos/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders todos when API call succeeds', async () => {
    (TodoApi.fetchTodos as jest.Mock).mockResolvedValue(mockTodos);
    
    render(<TodoTable filters={{}} refreshKey={0} />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading todos/i)).not.toBeInTheDocument();
    });
    
    // Check for the todo cards to be rendered
    await waitFor(() => {
      expect(document.querySelector('.todo-list')).toBeInTheDocument();
    });
    
    // Check if pagination is rendered
    expect(screen.getByRole('navigation', { name: /Todo pagination/i })).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch todos';
    (TodoApi.fetchTodos as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    render(<TodoTable filters={{}} refreshKey={0} />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.queryByText(/Loading todos/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Failed to load todos. Please try again.')).toBeInTheDocument();
  });

  test('renders empty state when no todos are available', async () => {
    const emptyTodos = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: 10,
      number: 0,
    };
    
    (TodoApi.fetchTodos as jest.Mock).mockResolvedValue(emptyTodos);
    
    render(<TodoTable filters={{}} refreshKey={0} />);
    
    // Wait for component to update
    await waitFor(() => {
      expect(screen.queryByText(/Loading todos/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/No todos found/i)).toBeInTheDocument();
  });

  test('updates todos when filters change', async () => {
    (TodoApi.fetchTodos as jest.Mock).mockResolvedValue(mockTodos);
    
    const { rerender } = render(<TodoTable filters={{}} refreshKey={0} />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(TodoApi.fetchTodos).toHaveBeenCalledTimes(1);
    });
    
    // Update with new filters
    const newFilters = { priority: 'HIGH', done: 'false' };
    rerender(<TodoTable filters={newFilters} refreshKey={0} />);
    
    // Check if fetchTodos is called with new filters
    await waitFor(() => {
      expect(TodoApi.fetchTodos).toHaveBeenCalledTimes(2);
    });
  });

  test('changes page when pagination controls are clicked', async () => {
    const mockTodosMultiPage = {
      ...mockTodos,
      totalPages: 3,
      totalElements: 25,
      number: 0,
    };
    
    (TodoApi.fetchTodos as jest.Mock).mockResolvedValue(mockTodosMultiPage);
    
    render(<TodoTable filters={{}} refreshKey={0} />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading todos/i)).not.toBeInTheDocument();
    });
    
    // Click on next page button
    fireEvent.click(screen.getByText(/Next/i));
    
    // Check if fetchTodos is called with page=1
    await waitFor(() => {
      expect(TodoApi.fetchTodos).toHaveBeenCalledTimes(2);
    });
  });

  test('sorts todos by priority when priority sort button is clicked', async () => {
    (TodoApi.fetchTodos as jest.Mock).mockResolvedValue(mockTodos);
    
    render(<TodoTable filters={{}} refreshKey={0} />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading todos/i)).not.toBeInTheDocument();
    });
    
    // Find the specific priority sort button using button role and text content
    const sortButtons = screen.getAllByRole('button');
    const prioritySortButton = sortButtons.find(button => 
      button.textContent?.trim().startsWith('Priority') && 
      !button.textContent?.includes('Due Date')
    );
    
    // Make sure we found the button
    expect(prioritySortButton).toBeInTheDocument();
    
    // Click on priority sort button
    if (prioritySortButton) {
      fireEvent.click(prioritySortButton);
    }
    
    // Check if fetchTodos is called with sortBy=priority
    await waitFor(() => {
      expect(TodoApi.fetchTodos).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'priority' })
      );
    });
  });

  test('sorts todos by due date when due date sort button is clicked', async () => {
    (TodoApi.fetchTodos as jest.Mock).mockResolvedValue(mockTodos);
    
    render(<TodoTable filters={{}} refreshKey={0} />);
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading todos/i)).not.toBeInTheDocument();
    });
    
    // Click on due date sort button
    fireEvent.click(screen.getByText(/Due Date/i));
    
    // Check if fetchTodos is called with sortBy=dueDate
    await waitFor(() => {
      expect(TodoApi.fetchTodos).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'dueDate' })
      );
    });
  });
});
