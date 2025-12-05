import express from 'express';
import { TaskService } from '../services/taskService';
import { UserService } from '../services/userService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { validateRequest, taskCreateSchema, taskUpdateSchema, categoryCreateSchema, categoryUpdateSchema } from '../middleware/validation';

const router = express.Router();
const taskService = new TaskService();
const userService = new UserService();

// Get user ID helper
const getUserId = async (firebaseUid: string): Promise<string> => {
  const authStubEnabled = process.env.AUTH_STUB === 'true' || process.env.NODE_ENV !== 'production';
  if (authStubEnabled) {
    // When using auth stub, ensure a corresponding DB user exists so Postgres queries receive a UUID.
    // We map the demo token uid into a firebaseUid field and sync via UserService.
    const demoFirebaseUid = firebaseUid || 'demo-user';
    const demoUserPayload = {
      id: '',
      firebaseUid: demoFirebaseUid,
      email: 'demo@accessibleos.com',
      displayName: 'Demo User',
      profilePictureUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    } as any;

    try {
      console.log('Auth stub: syncing demo user to DB with firebaseUid=', demoFirebaseUid);
      const synced = await userService.syncUser(demoUserPayload as any);
      console.log('Auth stub: synced user id=', synced.id);
      return synced.id;
    } catch (err) {
      console.error('Auth stub: failed to sync demo user', err);
      // Fall back to returning the firebaseUid to avoid breaking the request.
      return demoFirebaseUid;
    }
  }

  const user = await userService.getUserByFirebaseUid(firebaseUid);
  if (!user) {
    throw new Error('User not found');
  }
  return user.id;
};

// Task routes
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = await getUserId(req.user!.uid);
    const options = {
      status: req.query.status as string,
      priority: req.query.priority as string,
      categoryId: req.query.categoryId as string,
      parentTaskId: req.query.parentTaskId as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      sortBy: req.query.sortBy as string || 'created_at',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await taskService.getTasks(userId, options);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tasks'
    });
  }
});

router.post('/',
  authenticateToken,
  validateRequest(taskCreateSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = await getUserId(req.user!.uid);
      const task = await taskService.createTask(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  }
);

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = await getUserId(req.user!.uid);
    const task = await taskService.getTaskById(userId, req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get task'
    });
  }
});

router.put('/:id',
  authenticateToken,
  validateRequest(taskUpdateSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = await getUserId(req.user!.uid);
      const task = await taskService.updateTask(userId, req.params.id, req.body);
      
      res.json({
        success: true,
        data: task,
        message: 'Task updated successfully'
      });
    } catch (error) {
      console.error('Update task error:', error);
      if (error instanceof Error && error.message === 'Task not found') {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to update task'
        });
      }
    }
  }
);

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = await getUserId(req.user!.uid);
    await taskService.deleteTask(userId, req.params.id);
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    if (error instanceof Error && error.message === 'Task not found') {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete task'
      });
    }
  }
});

// Category routes
router.get('/categories', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = await getUserId(req.user!.uid);
    const categories = await taskService.getCategories(userId);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get categories'
    });
  }
});

router.post('/categories',
  authenticateToken,
  validateRequest(categoryCreateSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = await getUserId(req.user!.uid);
      const category = await taskService.createCategory(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create category'
      });
    }
  }
);

router.put('/categories/:id',
  authenticateToken,
  validateRequest(categoryUpdateSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = await getUserId(req.user!.uid);
      const category = await taskService.updateCategory(userId, req.params.id, req.body);
      
      res.json({
        success: true,
        data: category,
        message: 'Category updated successfully'
      });
    } catch (error) {
      console.error('Update category error:', error);
      if (error instanceof Error && error.message === 'Category not found') {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to update category'
        });
      }
    }
  }
);

router.delete('/categories/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = await getUserId(req.user!.uid);
    await taskService.deleteCategory(userId, req.params.id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    if (error instanceof Error && error.message === 'Category not found') {
      res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete category'
      });
    }
  }
});

export default router;