import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Metrics from '../components/Metrics';
import { TodoApi } from '../api/ToDoApi';

// Mock TodoApi
jest.mock('../api/ToDoApi', () => ({
  TodoApi: {
    fetchMetrics: jest.fn(),
  }
}));

describe('Metrics Component', () => {
  const mockMetrics = {
    overall: '3 days',
    doneCount: 10,
    byPriority: {
      HIGH: '2 days',
      MEDIUM: '4 days',
      LOW: '5 days',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    (TodoApi.fetchMetrics as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<Metrics />);
    
    expect(screen.getByText(/Loading metrics.../i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders metrics data when API call succeeds', async () => {
    (TodoApi.fetchMetrics as jest.Mock).mockResolvedValue(mockMetrics);
    
    render(<Metrics />);
    
    // Wait for metrics to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading metrics.../i)).not.toBeInTheDocument();
    });
    
    // Check if metrics title is rendered
    expect(screen.getByText(/Task Metrics/i)).toBeInTheDocument();
    
    // Check if overall metrics are rendered
    expect(screen.getByText(/Average Time to Complete/i)).toBeInTheDocument();
    expect(screen.getByText('3 days')).toBeInTheDocument();
    
    // Check if tasks completed count is rendered
    expect(screen.getByText(/Tasks Completed/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Check if priority metrics are rendered
    expect(screen.getByText(/Average Time by Priority/i)).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
    expect(screen.getByText('4 days')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch metrics';
    (TodoApi.fetchMetrics as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    render(<Metrics />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.queryByText(/Loading metrics.../i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('renders fallback message when no metrics are available', async () => {
    (TodoApi.fetchMetrics as jest.Mock).mockResolvedValue(null);
    
    render(<Metrics />);
    
    // Wait for component to update
    await waitFor(() => {
      expect(screen.queryByText(/Loading metrics.../i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/No metrics available./i)).toBeInTheDocument();
  });
});
