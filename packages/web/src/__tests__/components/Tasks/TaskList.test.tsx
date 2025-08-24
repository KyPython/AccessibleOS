import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../../../components/Tasks/TaskList';
import { AuthProvider } from '../../../contexts/AuthContext';
import { AccessibilityProvider } from '../../../contexts/AccessibilityContext';

const mockTasks = [
  {
    id: 'task-1',
    userId: 'user-1',
    title: 'Test Task 1',
    description: 'Test description',
    status: 'pending' as const,
    priority: 'high' as const,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    tags: ['test'],
    categories: [],
    sortOrder: 1
  },
  {
    id: 'task-2',
    userId: 'user-1',
    title: 'Test Task 2',
    status: 'completed' as const,
    priority: 'medium' as const,
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
    tags: [],
    categories: [],
    sortOrder: 2
  }
];

jest.mock('../../../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    categories: [],
    loading: false,
    error: null,
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
  })
}));

const MockedProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <AccessibilityProvider>
      {children}
    </AccessibilityProvider>
  </AuthProvider>
);

describe('TaskList', () => {
  it('renders task list with tasks', () => {
    render(
      <MockedProviders>
        <TaskList />
      </MockedProviders>
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('shows add task button', () => {
    render(
      <MockedProviders>
        <TaskList />
      </MockedProviders>
    );

    const addButton = screen.getByText('Add Task');
    expect(addButton).toBeInTheDocument();
  });

  it('opens task form when add button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MockedProviders>
        <TaskList />
      </MockedProviders>
    );

    const addButton = screen.getByText('Add Task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });

  it('displays empty state when no tasks', () => {
    jest.doMock('../../../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [],
        categories: [],
        loading: false,
        error: null,
        createTask: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn()
      })
    }));

    render(
      <MockedProviders>
        <TaskList />
      </MockedProviders>
    );

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('Create your first task to get started!')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(
      <MockedProviders>
        <TaskList />
      </MockedProviders>
    );

    const taskList = screen.getByRole('list');
    expect(taskList).toBeInTheDocument();

    const addButton = screen.getByLabelText('Add new task');
    expect(addButton).toBeInTheDocument();
  });

  it('shows loading state', () => {
    jest.doMock('../../../hooks/useTasks', () => ({
      useTasks: () => ({
        tasks: [],
        categories: [],
        loading: true,
        error: null,
        createTask: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn()
      })
    }));

    render(
      <MockedProviders>
        <TaskList />
      </MockedProviders>
    );

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });
});