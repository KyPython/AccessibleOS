import { TaskService } from '../../services/taskService';
import { query } from '../../config/database';

// Mock the database query function
jest.mock('../../config/database', () => ({
  query: jest.fn()
}));

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('creates a task successfully', async () => {
      const userId = 'user-123';
      const taskData = {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high' as const,
        tags: ['test']
      };

      const mockDbTask = {
        id: 'task-123',
        user_id: userId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        due_date: null,
        completed_at: null,
        created_at: new Date('2024-01-20T10:00:00Z'),
        updated_at: new Date('2024-01-20T10:00:00Z'),
        tags: taskData.tags,
        estimated_duration: null,
        actual_duration: null,
        parent_task_id: null,
        sort_order: 0
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockDbTask]
      });

      const result = await taskService.createTask(userId, taskData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tasks'),
        expect.arrayContaining([userId, taskData.title, taskData.description])
      );

      expect(result).toEqual({
        id: 'task-123',
        userId: userId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        dueDate: undefined,
        completedAt: undefined,
        createdAt: '2024-01-20T10:00:00.000Z',
        updatedAt: '2024-01-20T10:00:00.000Z',
        tags: taskData.tags,
        estimatedDuration: null,
        actualDuration: null,
        parentTaskId: null,
        sortOrder: 0,
        categories: []
      });
    });
  });

  describe('getTasks', () => {
    it('retrieves tasks with pagination', async () => {
      const userId = 'user-123';
      const options = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const
      };

      const mockDbTasks = [
        {
          id: 'task-1',
          user_id: userId,
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          priority: 'medium',
          due_date: null,
          completed_at: null,
          created_at: new Date('2024-01-20T10:00:00Z'),
          updated_at: new Date('2024-01-20T10:00:00Z'),
          tags: [],
          estimated_duration: null,
          actual_duration: null,
          parent_task_id: null,
          sort_order: 0
        }
      ];

      // Mock count query
      mockQuery.mockResolvedValueOnce({
        rows: [{ total: '1' }]
      });

      // Mock tasks query
      mockQuery.mockResolvedValueOnce({
        rows: mockDbTasks
      });

      // Mock category query for each task
      mockQuery.mockResolvedValueOnce({
        rows: []
      });

      const result = await taskService.getTasks(userId, options);

      expect(result).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 'task-1',
            title: 'Task 1'
          })
        ]),
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });

    it('filters tasks by status', async () => {
      const userId = 'user-123';
      const options = {
        status: 'completed',
        page: 1,
        limit: 10
      };

      mockQuery.mockResolvedValueOnce({
        rows: [{ total: '0' }]
      });

      mockQuery.mockResolvedValueOnce({
        rows: []
      });

      await taskService.getTasks(userId, options);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE t.user_id = $1 AND t.status = $2'),
        expect.arrayContaining([userId, 'completed'])
      );
    });
  });

  describe('updateTask', () => {
    it('updates a task successfully', async () => {
      const userId = 'user-123';
      const taskId = 'task-123';
      const updates = {
        title: 'Updated Task',
        status: 'completed' as const
      };

      const mockUpdatedTask = {
        id: taskId,
        user_id: userId,
        title: updates.title,
        description: 'Original description',
        status: updates.status,
        priority: 'medium',
        due_date: null,
        completed_at: new Date('2024-01-20T12:00:00Z'),
        created_at: new Date('2024-01-20T10:00:00Z'),
        updated_at: new Date('2024-01-20T12:00:00Z'),
        tags: [],
        estimated_duration: null,
        actual_duration: null,
        parent_task_id: null,
        sort_order: 0
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockUpdatedTask]
      });

      // Mock category query
      mockQuery.mockResolvedValueOnce({
        rows: []
      });

      const result = await taskService.updateTask(userId, taskId, updates);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE tasks'),
        expect.arrayContaining([updates.title, updates.status])
      );

      expect(result.title).toBe(updates.title);
      expect(result.status).toBe(updates.status);
    });

    it('throws error when task not found', async () => {
      const userId = 'user-123';
      const taskId = 'nonexistent-task';
      const updates = { title: 'Updated Task' };

      mockQuery.mockResolvedValueOnce({
        rows: []
      });

      await expect(
        taskService.updateTask(userId, taskId, updates)
      ).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('deletes a task successfully', async () => {
      const userId = 'user-123';
      const taskId = 'task-123';

      mockQuery.mockResolvedValueOnce({
        rowCount: 1
      });

      await taskService.deleteTask(userId, taskId);

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
        [taskId, userId]
      );
    });

    it('throws error when task not found', async () => {
      const userId = 'user-123';
      const taskId = 'nonexistent-task';

      mockQuery.mockResolvedValueOnce({
        rowCount: 0
      });

      await expect(
        taskService.deleteTask(userId, taskId)
      ).rejects.toThrow('Task not found');
    });
  });

  describe('createCategory', () => {
    it('creates a category successfully', async () => {
      const userId = 'user-123';
      const categoryData = {
        name: 'Work',
        color: '#3B82F6',
        icon: 'briefcase'
      };

      const mockDbCategory = {
        id: 'cat-123',
        user_id: userId,
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
        created_at: new Date('2024-01-20T10:00:00Z'),
        updated_at: new Date('2024-01-20T10:00:00Z')
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockDbCategory]
      });

      const result = await taskService.createCategory(userId, categoryData);

      expect(result).toEqual({
        id: 'cat-123',
        userId: userId,
        name: categoryData.name,
        color: categoryData.color,
        icon: categoryData.icon,
        createdAt: '2024-01-20T10:00:00.000Z',
        updatedAt: '2024-01-20T10:00:00.000Z'
      });
    });
  });

  describe('getCategories', () => {
    it('retrieves categories for user', async () => {
      const userId = 'user-123';

      const mockDbCategories = [
        {
          id: 'cat-1',
          user_id: userId,
          name: 'Work',
          color: '#3B82F6',
          icon: 'briefcase',
          created_at: new Date('2024-01-20T10:00:00Z'),
          updated_at: new Date('2024-01-20T10:00:00Z')
        },
        {
          id: 'cat-2',
          user_id: userId,
          name: 'Personal',
          color: '#10B981',
          icon: 'user',
          created_at: new Date('2024-01-20T10:00:00Z'),
          updated_at: new Date('2024-01-20T10:00:00Z')
        }
      ];

      mockQuery.mockResolvedValueOnce({
        rows: mockDbCategories
      });

      const result = await taskService.getCategories(userId);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Work');
      expect(result[1].name).toBe('Personal');
    });
  });
});