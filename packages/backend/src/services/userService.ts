import { query } from '../config/database';
import { User } from '../types';

export class UserService {
  async syncUser(userData: User): Promise<User> {
    const existingUser = await this.getUserByFirebaseUid(userData.firebaseUid);
    
    if (existingUser) {
      // Update existing user
      const updateQuery = `
        UPDATE users 
        SET email = $2, display_name = $3, profile_picture_url = $4, 
            last_login = NOW(), updated_at = NOW()
        WHERE firebase_uid = $1
        RETURNING *
      `;
      
      const result = await query(updateQuery, [
        userData.firebaseUid,
        userData.email,
        userData.displayName,
        userData.profilePictureUrl,
      ]);
      
      return this.mapDbUserToUser(result.rows[0]);
    } else {
      // Create new user
      const insertQuery = `
        INSERT INTO users (firebase_uid, email, display_name, profile_picture_url, last_login)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      
      const result = await query(insertQuery, [
        userData.firebaseUid,
        userData.email,
        userData.displayName,
        userData.profilePictureUrl,
      ]);
      
      const newUser = this.mapDbUserToUser(result.rows[0]);
      
      // Create default accessibility settings
      await this.createDefaultAccessibilitySettings(newUser.id);

      // If this is a demo user (firebase uid starts with 'demo'), seed demo categories/tasks
      // Only run demo seeding in non-production environments or when explicitly enabled
      try {
        const isDemo = !!(userData.firebaseUid && userData.firebaseUid.startsWith('demo'));
        const isProduction = process.env.NODE_ENV === 'production';
        // In production DEMO seeding is only allowed when explicitly enabled.
        const demoSeedEnabled = process.env.ENABLE_DEMO_SEED === 'true' || (!isProduction && process.env.AUTH_STUB === 'true');

        if (isDemo && demoSeedEnabled) {
          await this.createDemoSeedForUser(newUser.id);
        }
      } catch (err) {
        console.error('Failed to create demo seed for user:', err);
      }
      
      return newUser;
    }
  }

  // Seed demo categories and tasks for a user if they don't already have any
  private async createDemoSeedForUser(userId: string): Promise<void> {
    // Check whether user already has categories or tasks
    const catCheck = await query('SELECT 1 FROM task_categories WHERE user_id = $1 LIMIT 1', [userId]);
    const taskCheck = await query('SELECT 1 FROM tasks WHERE user_id = $1 LIMIT 1', [userId]);

    if (catCheck.rows.length > 0 || taskCheck.rows.length > 0) {
      // already seeded
      return;
    }

    // Insert two default categories
    const insertCatQuery = `
      INSERT INTO task_categories (user_id, name, color, icon)
      VALUES ($1, $2, $3, $4), ($1, $5, $6, $7)
      RETURNING *
    `;

    const catResult = await query(insertCatQuery, [
      userId,
      'Work', '#3B82F6', 'briefcase',
      'Personal', '#F59E0B', 'user'
    ]);

    const workCat = catResult.rows[0];
    const personalCat = catResult.rows[1];

    // Insert two demo tasks
    const insertTaskQuery = `
      INSERT INTO tasks (user_id, title, description, status, priority, due_date, tags, estimated_duration, sort_order)
      VALUES
      ($1, $2, $3, 'in_progress', 'high', NOW() + INTERVAL '2 days', $4, 120, 1),
      ($1, $5, $6, 'pending', 'medium', NOW() + INTERVAL '7 days', $7, 30, 2)
      RETURNING *
    `;

    const taskResult = await query(insertTaskQuery, [
      userId,
      'Complete project proposal', 'Finish the Q1 project proposal document with accessibility guidelines', ['work','proposal'],
      'Schedule doctor appointment', 'Book annual health checkup and eye exam', ['health','personal']
    ]);

    const task1 = taskResult.rows[0];
    const task2 = taskResult.rows[1];

    // Assign categories to tasks
    await query('INSERT INTO task_category_assignments (task_id, category_id) VALUES ($1, $2)', [task1.id, workCat.id]);
    await query('INSERT INTO task_category_assignments (task_id, category_id) VALUES ($1, $2)', [task2.id, personalCat.id]);

    // Create or update accessibility settings for demo user with friendly defaults
    const accQuery = `
      INSERT INTO accessibility_settings (
        user_id, voice_over_enabled, voice_over_speed, keyboard_navigation_enabled,
        high_contrast_mode, font_size_multiplier, screen_reader_enabled, motion_reduced, color_blind_mode, custom_css
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id) DO UPDATE SET
        voice_over_enabled = EXCLUDED.voice_over_enabled,
        voice_over_speed = EXCLUDED.voice_over_speed,
        keyboard_navigation_enabled = EXCLUDED.keyboard_navigation_enabled,
        high_contrast_mode = EXCLUDED.high_contrast_mode,
        font_size_multiplier = EXCLUDED.font_size_multiplier,
        screen_reader_enabled = EXCLUDED.screen_reader_enabled,
        motion_reduced = EXCLUDED.motion_reduced,
        color_blind_mode = EXCLUDED.color_blind_mode,
        custom_css = EXCLUDED.custom_css,
        updated_at = NOW()
    `;

    await query(accQuery, [
      userId,
      true, // voice_over_enabled
      1.2,  // voice_over_speed
      true, // keyboard_navigation_enabled
      false, // high_contrast_mode
      1.2,  // font_size_multiplier
      true, // screen_reader_enabled
      false, // motion_reduced
      null, // color_blind_mode
      null  // custom_css
    ]);

    // Create or update initial game progress for demo user
    const gpQuery = `
      INSERT INTO game_progress (
        user_id, level, experience_points, achievements, current_streak,
        longest_streak, tasks_completed_today, last_activity_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
      ON CONFLICT (user_id) DO UPDATE SET
        level = EXCLUDED.level,
        experience_points = EXCLUDED.experience_points,
        achievements = EXCLUDED.achievements,
        current_streak = EXCLUDED.current_streak,
        longest_streak = EXCLUDED.longest_streak,
        tasks_completed_today = EXCLUDED.tasks_completed_today,
        last_activity_date = EXCLUDED.last_activity_date,
        updated_at = NOW()
    `;

    await query(gpQuery, [
      userId,
      3, // level
      450, // experience_points
      ['First Task', 'Accessibility Win'], // achievements
      5, // current_streak
      10, // longest_streak
      1 // tasks_completed_today
    ]);
  }

  // Delete demo data for a given user id. This is a dev-only helper for tests
  // and demo resets. It removes tasks, categories, assignments, accessibility
  // settings, game progress and the user row. Guarded to avoid accidental use
  // in production.
  async resetDemoForUser(userId: string): Promise<void> {
    const isProduction = process.env.NODE_ENV === 'production';
    const allowReset = process.env.ENABLE_DEMO_SEED === 'true' || process.env.AUTH_STUB === 'true' || !isProduction;
    if (!allowReset) {
      throw new Error('Demo reset is disabled in this environment');
    }

    // Cascade deletes due to FK constraints will remove related rows if we
    // delete the user, but we'll attempt targeted deletes first to be explicit.
    await query('DELETE FROM task_category_assignments WHERE task_id IN (SELECT id FROM tasks WHERE user_id = $1)', [userId]);
    await query('DELETE FROM task_category_assignments WHERE category_id IN (SELECT id FROM task_categories WHERE user_id = $1)', [userId]);
    await query('DELETE FROM tasks WHERE user_id = $1', [userId]);
    await query('DELETE FROM task_categories WHERE user_id = $1', [userId]);
    await query('DELETE FROM accessibility_settings WHERE user_id = $1', [userId]);
    await query('DELETE FROM game_progress WHERE user_id = $1', [userId]);
    await query('DELETE FROM notifications WHERE user_id = $1', [userId]);
    // Finally remove the user row
    await query('DELETE FROM users WHERE id = $1', [userId]);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [firebaseUid]
    );
    
    return result.rows.length > 0 ? this.mapDbUserToUser(result.rows[0]) : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows.length > 0 ? this.mapDbUserToUser(result.rows[0]) : null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    if (updates.displayName !== undefined) {
      setClause.push(`display_name = $${paramCount++}`);
      values.push(updates.displayName);
    }

    if (updates.profilePictureUrl !== undefined) {
      setClause.push(`profile_picture_url = $${paramCount++}`);
      values.push(updates.profilePictureUrl);
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const updateQuery = `
      UPDATE users 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return this.mapDbUserToUser(result.rows[0]);
  }

  private async createDefaultAccessibilitySettings(userId: string): Promise<void> {
    const insertQuery = `
      INSERT INTO accessibility_settings (
        user_id, voice_over_enabled, voice_over_speed, keyboard_navigation_enabled,
        high_contrast_mode, font_size_multiplier, screen_reader_enabled, motion_reduced
      ) VALUES ($1, false, 1.0, false, false, 1.0, false, false)
    `;
    
    await query(insertQuery, [userId]);
  }

  private mapDbUserToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      firebaseUid: dbUser.firebase_uid,
      email: dbUser.email,
      displayName: dbUser.display_name,
      profilePictureUrl: dbUser.profile_picture_url,
      createdAt: dbUser.created_at.toISOString(),
      updatedAt: dbUser.updated_at.toISOString(),
      lastLogin: dbUser.last_login?.toISOString(),
      isActive: dbUser.is_active,
    };
  }
}