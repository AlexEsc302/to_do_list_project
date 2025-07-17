import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Metrics from '../components/Metrics';
import * as api from '../api/ToDoApi';

// Mock fetchMetrics function
jest.mock('../api/ToDoApi');

describe('Metrics', () => {
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

  
});
