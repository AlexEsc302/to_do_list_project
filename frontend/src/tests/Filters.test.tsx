import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../components/Filters';

describe('Filters Component', () => {
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  test('renders with collapsed filter panel by default', () => {
    render(<Filters onFilterChange={mockOnFilterChange} />);
    
    // Header should be visible
    expect(screen.getByText(/Filter Tasks/i)).toBeInTheDocument();
    
    // Expand icon should be visible (▼)
    expect(screen.getByText('▼')).toBeInTheDocument();
    
    // Content should be collapsed initially
    const filterContent = document.querySelector('.filter-card-content');
    expect(filterContent).not.toHaveClass('open');
  });
  
  test('expands and collapses filter panel when clicked', () => {
    render(<Filters onFilterChange={mockOnFilterChange} />);
    
    // Find the header element using text content instead of querySelector
    const headerElement = screen.getByText(/Filter Tasks/i);
    
    // Click to expand
    fireEvent.click(headerElement);
    
    // Content should be expanded
    const filterContent = document.querySelector('.filter-card-content');
    expect(filterContent).toHaveClass('open');
    
    // Expand icon should be changed to ▲
    expect(screen.getByText('▲')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(headerElement);
    
    // Content should be collapsed again
    expect(filterContent).not.toHaveClass('open');
    
    // Expand icon should be changed back to ▼
    expect(screen.getByText('▼')).toBeInTheDocument();
  });
  
  test('calls onFilterChange with correct values when Apply button is clicked', () => {
    render(<Filters onFilterChange={mockOnFilterChange} />);
    
    // First, expand the filter panel
    const headerElement = screen.getByText(/Filter Tasks/i);
    fireEvent.click(headerElement);
    
    // Set filter values
    fireEvent.change(screen.getByPlaceholderText(/Search by task name/i), { target: { value: 'Meeting' } });
    fireEvent.change(screen.getByLabelText(/Priority filter/i), { target: { value: 'HIGH' } });
    fireEvent.change(screen.getByLabelText(/Status filter/i), { target: { value: 'true' } });
    
    // Click Apply button
    fireEvent.click(screen.getByText(/Apply/i));
    
    // Check if onFilterChange was called with correct filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      name: 'Meeting',
      priority: 'HIGH',
      done: 'true',
    });
  });
  
  test('resets all fields and calls onFilterChange with empty object on Reset button click', () => {
    render(<Filters onFilterChange={mockOnFilterChange} />);
    
    // First, expand the filter panel
    const headerElement = screen.getByText(/Filter Tasks/i);
    fireEvent.click(headerElement);
    
    // Set filter values
    fireEvent.change(screen.getByPlaceholderText(/Search by task name/i), { target: { value: 'Task' } });
    fireEvent.change(screen.getByLabelText(/Priority filter/i), { target: { value: 'LOW' } });
    fireEvent.change(screen.getByLabelText(/Status filter/i), { target: { value: 'false' } });
    
    // Click Reset button
    fireEvent.click(screen.getByText(/Reset/i));
    
    // Check if fields are reset
    expect(screen.getByPlaceholderText(/Search by task name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Priority filter/i)).toHaveValue('all');
    expect(screen.getByLabelText(/Status filter/i)).toHaveValue('all');
    
    // Check if onFilterChange was called with empty object
    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });
  
  test('shows active filter count badge when filters are applied', () => {
    render(<Filters onFilterChange={mockOnFilterChange} />);
    
    // First, expand the filter panel
    const headerElement = screen.getByText(/Filter Tasks/i);
    fireEvent.click(headerElement);
    
    // Set filter values
    fireEvent.change(screen.getByPlaceholderText(/Search by task name/i), { target: { value: 'Task' } });
    fireEvent.change(screen.getByLabelText(/Priority filter/i), { target: { value: 'LOW' } });
    
    // Click Apply to apply filters
    fireEvent.click(screen.getByText(/Apply/i));
    
    // Collapse the panel to see the badge
    fireEvent.click(headerElement);
    
    // Check if badge with count "2" is shown
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('filter-badge');
  });
});
