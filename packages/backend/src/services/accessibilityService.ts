import { query } from '../config/database';
import { AccessibilitySettings } from '../types';

export class AccessibilityService {
  async getSettings(userId: string): Promise<AccessibilitySettings | null> {
    const result = await query(
      'SELECT * FROM accessibility_settings WHERE user_id = $1',
      [userId]
    );

    return result.rows.length > 0 ? this.mapDbSettingsToSettings(result.rows[0]) : null;
  }

  async updateSettings(userId: string, updates: Partial<AccessibilitySettings>): Promise<AccessibilitySettings> {
    // First, try to get existing settings
    const existing = await this.getSettings(userId);
    
    if (!existing) {
      // Create new settings if they don't exist
      return this.createSettings(userId, updates);
    }

    const setClause = [];
    const values = [];
    let paramCount = 1;

    const allowedUpdates = [
      'voiceOverEnabled', 'voiceOverSpeed', 'keyboardNavigationEnabled',
      'highContrastMode', 'fontSizeMultiplier', 'screenReaderEnabled',
      'motionReduced', 'colorBlindMode', 'customCss'
    ];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key) && value !== undefined) {
        const dbKey = this.camelToSnake(key);
        setClause.push(`${dbKey} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (setClause.length === 0) {
      return existing;
    }

    setClause.push(`updated_at = NOW()`);
    values.push(userId);

    const updateQuery = `
      UPDATE accessibility_settings 
      SET ${setClause.join(', ')}
      WHERE user_id = $${paramCount++}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    
    if (result.rows.length === 0) {
      throw new Error('Settings not found');
    }

    return this.mapDbSettingsToSettings(result.rows[0]);
  }

  private async createSettings(userId: string, settingsData: Partial<AccessibilitySettings>): Promise<AccessibilitySettings> {
    const insertQuery = `
      INSERT INTO accessibility_settings (
        user_id, voice_over_enabled, voice_over_speed, keyboard_navigation_enabled,
        high_contrast_mode, font_size_multiplier, screen_reader_enabled, motion_reduced,
        color_blind_mode, custom_css
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await query(insertQuery, [
      userId,
      settingsData.voiceOverEnabled ?? false,
      settingsData.voiceOverSpeed ?? 1.0,
      settingsData.keyboardNavigationEnabled ?? false,
      settingsData.highContrastMode ?? false,
      settingsData.fontSizeMultiplier ?? 1.0,
      settingsData.screenReaderEnabled ?? false,
      settingsData.motionReduced ?? false,
      settingsData.colorBlindMode ?? null,
      settingsData.customCss ?? null,
    ]);

    return this.mapDbSettingsToSettings(result.rows[0]);
  }

  private mapDbSettingsToSettings(dbSettings: any): AccessibilitySettings {
    return {
      id: dbSettings.id,
      userId: dbSettings.user_id,
      voiceOverEnabled: dbSettings.voice_over_enabled,
      voiceOverSpeed: dbSettings.voice_over_speed,
      keyboardNavigationEnabled: dbSettings.keyboard_navigation_enabled,
      highContrastMode: dbSettings.high_contrast_mode,
      fontSizeMultiplier: dbSettings.font_size_multiplier,
      screenReaderEnabled: dbSettings.screen_reader_enabled,
      motionReduced: dbSettings.motion_reduced,
      colorBlindMode: dbSettings.color_blind_mode,
      customCss: dbSettings.custom_css,
      createdAt: dbSettings.created_at.toISOString(),
      updatedAt: dbSettings.updated_at.toISOString(),
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}