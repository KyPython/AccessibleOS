import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from '../../hooks/useTasks';

// Mock Firebase auth
const mockGetIdToken = jest.fn().mockResolvedValue('mock-token');
jest.mock('../../config/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: mockGetIdToken
    }
  }
}));

// Mock fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('useTasks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('fetches tasks successfully', async () => {
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Test Task',
        status: 'pending',
        priority: 'medium',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      }
    ];

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: mockTasks,
          total: 1,
          page: 1,
          totalPages: 1
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: []
        })
      } as Response);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.total).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.tasks).toEqual([]);
  });

  it('creates task successfully', async () => {
    const newTask = {
      title: 'New Task',
      description: 'Test description',
      priority: 'high' as const
    };

    const createdTask = {
      id: 'task-2',
      ...newTask,
      status: 'pending',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    };

    // Mock initial fetch calls
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response)
      // Mock create task call
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: createdTask
        })
      } as Response)
      // Mock refetch calls after creation
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [createdTask],
          total: 1,
          page: 1,
          totalPages: 1
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const task = await result.current.createTask(newTask);

    expect(task).toEqual(createdTask);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/tasks'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newTask)
      })
    );
  });

  it('updates task successfully', async () => {
    const taskId = 'task-1';
    const updates = { title: 'Updated Task' };
    const updatedTask = {
      id: taskId,
      title: 'Updated Task',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T11:00:00Z'
    };

    // Mock initial fetch calls
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response)
      // Mock update task call
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: updatedTask
        })
      } as Response)
      // Mock refetch calls after update
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: [updatedTask],
          total: 1,
          page: 1,
          totalPages: 1
        })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const task = await result.current.updateTask(taskId, updates);

    expect(task).toEqual(updatedTask);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/tasks/${taskId}`),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updates)
      })
    );
  });

  it('deletes task successfully', async () => {
    const taskId = 'task-1';

    // Mock initial fetch calls
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response)
      // Mock delete task call
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      } as Response)
      // Mock refetch calls after deletion
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response);

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.deleteTask(taskId);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/tasks/${taskId}`),
      expect.objectContaining({
        method: 'DELETE'
      })
    );
  });

  it('includes authorization header in requests', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], total: 0, page: 1, totalPages: 0 })
    } as Response);

    renderHook(() => useTasks());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token'
        })
      })
    );
  });
});