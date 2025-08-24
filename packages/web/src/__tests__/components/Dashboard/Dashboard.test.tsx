import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../../contexts/AuthContext';
import { AccessibilityProvider } from '../../../contexts/AccessibilityContext';
import Dashboard from '../../../components/Dashboard/Dashboard';

// Mock the hooks
jest.mock('../../../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [
      {
        id: 'task-1',
        title: 'Test Task',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-01-25T17:00:00Z',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z',
        tags: ['test'],
        categories: [],
        sortOrder: 1,
        userId: 'user-1'
      }
    ],
    loading: false,
    error: null
  })
}));

const MockedProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <AccessibilityProvider>
      {children}
    </AccessibilityProvider>
  </AuthProvider>
);

describe('Dashboard', () => {
  it('renders dashboard with user greeting', async () => {
    render(
      <MockedProviders>
        <Dashboard />
      </MockedProviders>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
    });
  });

  it('displays task statistics', async () => {
    render(
      <MockedProviders>
        <Dashboard />
      </MockedProviders>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Completed tasks count
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    // Mock loading state
    jest.doMock('../../../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [],
        loading: true,
        error: null
      })
    }));

    render(
      <MockedProviders>
        <Dashboard />
      </MockedProviders>
    );

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('renders task stats cards', async () => {
    render(
      <MockedProviders>
        <Dashboard />
      </MockedProviders>
    );

    await waitFor(() => {
      expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
      expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', async () => {
    render(
      <MockedProviders>
        <Dashboard />
      </MockedProviders>
    );

    await waitFor(() => {
      const quickActionButton = screen.getByLabelText('Add new task');
      expect(quickActionButton).toBeInTheDocument();
      expect(quickActionButton).toHaveAttribute('aria-label', 'Add new task');
    });
  });
});