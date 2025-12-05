import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TaskList } from '../components/TaskList';

// Mock fetch
global.fetch = jest.fn();

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test description',
    status: 'PENDING' as const,
    dueDate: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    altText: null,
    hasMedia: false,
    labels: [],
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: null,
    status: 'IN_PROGRESS' as const,
    dueDate: '2024-12-31T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    altText: 'A descriptive alt text',
    hasMedia: true,
    labels: ['urgent'],
  },
];

describe('TaskList', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders task list with proper ARIA roles', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockTasks }),
    });

    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  it('displays empty state when no tasks', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No tasks found/i)
      ).toBeInTheDocument();
    });
  });

  it('shows create task button with proper label', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const createButton = screen.getByRole('link', { name: /create new task/i });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute('href', '/tasks/new');
    });
  });
});

