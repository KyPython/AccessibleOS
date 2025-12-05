import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TaskList } from '../../components/TaskList';

expect.extend(toHaveNoViolations);

// Mock fetch
global.fetch = jest.fn();

describe('TaskList Accessibility', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should not have any accessibility violations', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: '1',
            title: 'Test Task',
            description: 'Test description',
            status: 'PENDING',
            dueDate: null,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            altText: null,
            hasMedia: false,
            labels: [],
          },
        ],
      }),
    });

    const { container } = render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    // Wait for async content to load
    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 10000); // Increase timeout for axe analysis

  it('should have proper ARIA labels on buttons', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: '1',
            title: 'Test Task',
            description: 'Test description',
            status: 'PENDING',
            dueDate: null,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            altText: null,
            hasMedia: false,
            labels: [],
          },
        ],
      }),
    });

    const { getByLabelText } = render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for proper ARIA labels on action buttons
    const editButton = getByLabelText(/edit task: test task/i);
    expect(editButton).toBeInTheDocument();

    const deleteButton = getByLabelText(/delete task: test task/i);
    expect(deleteButton).toBeInTheDocument();
  });
});

