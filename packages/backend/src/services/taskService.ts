import { query } from '../config/database';
import { Task, TaskCategory, PaginatedResponse } from '../types';

// In-memory fallback for development/testing if DB isn't configured
// Enable in-memory store only when USE_IN_MEMORY_DB=true
// Note: do NOT auto-enable in-memory based on NODE_ENV so unit tests that
// mock the DB will exercise the query path.
const useInMemory = process.env.USE_IN_MEMORY_DB === 'true';
const inMemoryStore: { tasks: Task[]; categories: TaskCategory[] } = {
  tasks: [],
  categories: []
};

// Seed demo data for development stub user 'demo-user' (or demo-<id>)
if (useInMemory) {
  const demoUserId = 'demo-user';
  if (inMemoryStore.tasks.length === 0) {
    inMemoryStore.categories.push(
      {
        id: 'cat-1',
        userId: demoUserId,
        name: 'Work',
        color: '#3B82F6',
        icon: 'briefcase',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cat-2',
        userId: demoUserId,
        name: 'Personal',
        color: '#F59E0B',
        icon: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    inMemoryStore.tasks.push(
      {
        id: 'task-1',
        userId: demoUserId,
        title: 'Complete project proposal',
        description: 'Finish the Q1 project proposal document with accessibility guidelines',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['work', 'proposal'],
        estimatedDuration: 120,
        actualDuration: undefined,
        parentTaskId: undefined,
        sortOrder: 1,
        categories: [inMemoryStore.categories[0]]
      },
      {
        id: 'task-2',
        userId: demoUserId,
        title: 'Schedule doctor appointment',
        description: 'Book annual health checkup and eye exam',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['health', 'personal'],
        estimatedDuration: 30,
        actualDuration: undefined,
        parentTaskId: undefined,
        sortOrder: 2,
        categories: [inMemoryStore.categories[1]]
      }
    );
  }
}

export class TaskService {
  async createTask(userId: string, taskData: Partial<Task>): Promise<Task> {
    if (useInMemory) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        userId,
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        completedAt: taskData.completedAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: taskData.tags || [],
        estimatedDuration: taskData.estimatedDuration,
        actualDuration: taskData.actualDuration,
        parentTaskId: taskData.parentTaskId,
        sortOrder: taskData.sortOrder || 0,
        categories: taskData.categories || []
      };

      inMemoryStore.tasks.unshift(newTask);
      return newTask;
    }

    const insertQuery = `
      INSERT INTO tasks (
        user_id, title, description, priority, due_date, estimated_duration,
        tags, parent_task_id, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await query(insertQuery, [
      userId,
      taskData.title,
      taskData.description,
      taskData.priority || 'medium',
      taskData.dueDate ? new Date(taskData.dueDate) : null,
      taskData.estimatedDuration,
      taskData.tags || [],
      taskData.parentTaskId,
      taskData.sortOrder || 0,
    ]);

    const task = this.mapDbTaskToTask(result.rows[0]);

    // Handle category assignments
    if (taskData.categories && taskData.categories.length > 0) {
      await this.assignTaskCategories(task.id, taskData.categories.map(c => c.id));
      task.categories = taskData.categories;
    }

    return task;
  }

  async getTasks(
    userId: string,
    options: {
      status?: string;
      priority?: string;
      categoryId?: string;
      parentTaskId?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<PaginatedResponse<Task>> {
    const {
      status,
      priority,
      categoryId,
      parentTaskId,
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = options;

    if (useInMemory) {
      const userTasks = inMemoryStore.tasks.filter(t => t.userId === userId);
      return {
        data: userTasks,
        total: userTasks.length,
        page: 1,
        limit: userTasks.length,
        totalPages: 1
      };
    }

    let whereClause = 'WHERE t.user_id = $1';
    const values = [userId];
    let paramCount = 2;

    if (status) {
      whereClause += ` AND t.status = $${paramCount++}`;
      values.push(status);
    }

    if (priority) {
      whereClause += ` AND t.priority = $${paramCount++}`;
      values.push(priority);
    }

    if (categoryId) {
      whereClause += ` AND EXISTS (
        SELECT 1 FROM task_category_assignments tca 
        WHERE tca.task_id = t.id AND tca.category_id = $${paramCount++}
      )`;
      values.push(categoryId);
    }

    if (parentTaskId !== undefined) {
      if (parentTaskId === null) {
        whereClause += ' AND t.parent_task_id IS NULL';
      } else {
        whereClause += ` AND t.parent_task_id = $${paramCount++}`;
        values.push(parentTaskId);
      }
    }

    const offset = (page - 1) * limit;
    const orderBy = `ORDER BY t.${sortBy} ${sortOrder.toUpperCase()}`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks t
      ${whereClause}
    `;
  const countResult: any = await query(countQuery, values);
  const total = parseInt(countResult.rows[0].total);

    // Get tasks
    const tasksQuery = `
      SELECT t.*
      FROM tasks t
      ${whereClause}
      ${orderBy}
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;
    values.push(limit.toString(), offset.toString());

    const tasksResult: any = await query(tasksQuery, values);
    const tasks = await Promise.all(
      tasksResult.rows.map(async (row: any) => {
        const task = this.mapDbTaskToTask(row);
        task.categories = await this.getTaskCategories(task.id);
        return task;
      })
    );

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(userId: string, taskId: string): Promise<Task | null> {
    if (useInMemory) {
      const t = inMemoryStore.tasks.find(x => x.id === taskId && x.userId === userId);
      return t || null;
    }

    const result = await query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const task = this.mapDbTaskToTask(result.rows[0]);
    task.categories = await this.getTaskCategories(task.id);
    return task;
  }

  async updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<Task> {
    if (useInMemory) {
      const idx = inMemoryStore.tasks.findIndex(t => t.id === taskId && t.userId === userId);
      if (idx === -1) throw new Error('Task not found');
      const updated = { ...inMemoryStore.tasks[idx], ...updates, updatedAt: new Date().toISOString() } as Task;
      inMemoryStore.tasks[idx] = updated;
      return updated;
    }

    const setClause = [];
    const values = [];
    let paramCount = 1;

    const allowedUpdates = [
      'title', 'description', 'status', 'priority', 'dueDate', 'completedAt',
      'estimatedDuration', 'actualDuration', 'tags', 'parentTaskId', 'sortOrder'
    ];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key) && value !== undefined) {
        const dbKey = this.camelToSnake(key);
        setClause.push(`${dbKey} = $${paramCount++}`);
        
        if (key === 'dueDate' || key === 'completedAt') {
          values.push(value ? new Date(value as string) : null);
        } else {
          values.push(value);
        }
      }
    }

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    setClause.push(`updated_at = NOW()`);
    values.push(taskId, userId);

    const updateQuery = `
      UPDATE tasks 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    
    if (result.rows.length === 0) {
      throw new Error('Task not found');
    }

    const task = this.mapDbTaskToTask(result.rows[0]);
    
    // Handle category updates
    if (updates.categories) {
      await this.updateTaskCategories(task.id, updates.categories.map(c => c.id));
      task.categories = updates.categories;
    } else {
      task.categories = await this.getTaskCategories(task.id);
    }

    return task;
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    if (useInMemory) {
      const idx = inMemoryStore.tasks.findIndex(t => t.id === taskId && t.userId === userId);
      if (idx === -1) throw new Error('Task not found');
      inMemoryStore.tasks.splice(idx, 1);
      return;
    }

    const result = await query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error('Task not found');
    }
  }

  // Category methods
  async createCategory(userId: string, categoryData: Partial<TaskCategory>): Promise<TaskCategory> {
    const insertQuery = `
      INSERT INTO task_categories (user_id, name, color, icon)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await query(insertQuery, [
      userId,
      categoryData.name,
      categoryData.color,
      categoryData.icon,
    ]);

    return this.mapDbCategoryToCategory(result.rows[0]);
  }

  async getCategories(userId: string): Promise<TaskCategory[]> {
    const result = await query(
      'SELECT * FROM task_categories WHERE user_id = $1 ORDER BY name',
      [userId]
    );

  return result.rows.map((row: any) => this.mapDbCategoryToCategory(row));
  }

  async updateCategory(userId: string, categoryId: string, updates: Partial<TaskCategory>): Promise<TaskCategory> {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      setClause.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }

    if (updates.color !== undefined) {
      setClause.push(`color = $${paramCount++}`);
      values.push(updates.color);
    }

    if (updates.icon !== undefined) {
      setClause.push(`icon = $${paramCount++}`);
      values.push(updates.icon);
    }

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    setClause.push(`updated_at = NOW()`);
    values.push(categoryId, userId);

    const updateQuery = `
      UPDATE task_categories 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount++} AND user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    
    if (result.rows.length === 0) {
      throw new Error('Category not found');
    }

    return this.mapDbCategoryToCategory(result.rows[0]);
  }

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const result = await query(
      'DELETE FROM task_categories WHERE id = $1 AND user_id = $2',
      [categoryId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error('Category not found');
    }
  }

  // Private helper methods
  private async assignTaskCategories(taskId: string, categoryIds: string[]): Promise<void> {
    if (categoryIds.length === 0) return;

    const values = categoryIds.map((_, index) => 
      `($1, $${index + 2})`
    ).join(', ');

    const insertQuery = `
      INSERT INTO task_category_assignments (task_id, category_id)
      VALUES ${values}
      ON CONFLICT DO NOTHING
    `;

    await query(insertQuery, [taskId, ...categoryIds]);
  }

  private async updateTaskCategories(taskId: string, categoryIds: string[]): Promise<void> {
    // Remove existing assignments
    await query('DELETE FROM task_category_assignments WHERE task_id = $1', [taskId]);
    
    // Add new assignments
    await this.assignTaskCategories(taskId, categoryIds);
  }

  private async getTaskCategories(taskId: string): Promise<TaskCategory[]> {
    const result = await query(`
      SELECT tc.*
      FROM task_categories tc
      JOIN task_category_assignments tca ON tc.id = tca.category_id
      WHERE tca.task_id = $1
      ORDER BY tc.name
    `, [taskId]);

  return result.rows.map((row: any) => this.mapDbCategoryToCategory(row));
  }

  private mapDbTaskToTask(dbTask: any): Task {
    return {
      id: dbTask.id,
      userId: dbTask.user_id,
      title: dbTask.title,
      description: dbTask.description,
      status: dbTask.status,
      priority: dbTask.priority,
      dueDate: dbTask.due_date?.toISOString(),
      completedAt: dbTask.completed_at?.toISOString(),
      createdAt: dbTask.created_at.toISOString(),
      updatedAt: dbTask.updated_at.toISOString(),
      tags: dbTask.tags || [],
      estimatedDuration: dbTask.estimated_duration,
      actualDuration: dbTask.actual_duration,
      parentTaskId: dbTask.parent_task_id,
      sortOrder: dbTask.sort_order,
      categories: [], // Will be populated separately
    };
  }

  private mapDbCategoryToCategory(dbCategory: any): TaskCategory {
    return {
      id: dbCategory.id,
      userId: dbCategory.user_id,
      name: dbCategory.name,
      color: dbCategory.color,
      icon: dbCategory.icon,
      createdAt: dbCategory.created_at.toISOString(),
      updatedAt: dbCategory.updated_at.toISOString(),
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}