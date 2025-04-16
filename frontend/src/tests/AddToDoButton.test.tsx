import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddToDoButton from '../components/AddToDoButton';

jest.mock('../api/ToDoApi', () => ({
  createTodo: jest.fn(),
}));

import { createTodo } from '../api/ToDoApi';

describe('AddToDoButton', () => {
  it('allows input and submits the form', async () => {
    const mockOnAdd = jest.fn();
    (createTodo as jest.Mock).mockResolvedValueOnce({}); 

    render(<AddToDoButton onAdd={mockOnAdd} />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/Add New ToDo/i));

    await user.type(screen.getByLabelText(/Name:/i), 'Test task');
    await user.type(screen.getByLabelText(/Description:/i), 'A description');
    await user.selectOptions(screen.getByLabelText(/Priority:/i), 'MEDIUM');
    await user.type(screen.getByLabelText(/Due Date:/i), '2025-05-01');

    await user.click(screen.getByText(/Create ToDo/i));

    await waitFor(() => {
      expect(createTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test task',
          description: 'A description',
          priority: 'MEDIUM',
          dueDate: '2025-05-01',
          done: false,
          doneDate: null,
        })
      );
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });
});
