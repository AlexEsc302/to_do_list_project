import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../components/Filters';

describe('Filters Component', () => {
  test('renders all filter inputs and buttons', () => {
    render(<Filters onFilterChange={jest.fn()} />);

    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State:/i)).toBeInTheDocument();

    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });

  test('calls onFilterChange with correct values when "Search" is clicked', () => {
    const mockOnFilterChange = jest.fn();
    render(<Filters onFilterChange={mockOnFilterChange} />);

    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'Meeting' } });
    fireEvent.change(screen.getByLabelText(/Priority:/i), { target: { value: 'HIGH' } });
    fireEvent.change(screen.getByLabelText(/State:/i), { target: { value: 'true' } });

    fireEvent.click(screen.getByText(/Search/i));

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: 'Meeting',
      priority: 'HIGH',
      done: 'true',
    });
  });

  test('resets all fields and calls onFilterChange with empty object on "Reset"', () => {
    const mockOnFilterChange = jest.fn();
    render(<Filters onFilterChange={mockOnFilterChange} />);

    fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'Task' } });
    fireEvent.change(screen.getByLabelText(/Priority:/i), { target: { value: 'LOW' } });
    fireEvent.change(screen.getByLabelText(/State:/i), { target: { value: 'false' } });

    fireEvent.click(screen.getByText(/Reset/i));

    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });
});
