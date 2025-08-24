import express from 'express';
import { AccessibilityService } from '../services/accessibilityService';
import { UserService } from '../services/userService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { validateRequest, accessibilitySettingsSchema } from '../middleware/validation';

const router = express.Router();
const accessibilityService = new AccessibilityService();
const userService = new UserService();

// Get user ID helper
const getUserId = async (firebaseUid: string): Promise<string> => {
  const user = await userService.getUserByFirebaseUid(firebaseUid);
  if (!user) {
    throw new Error('User not found');
  }
  return user.id;
};

// Get accessibility settings
router.get('/settings', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = await getUserId(req.user!.uid);
    const settings = await accessibilityService.getSettings(userId);
    
    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Accessibility settings not found'
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get accessibility settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get accessibility settings'
    });
  }
});

// Update accessibility settings
router.put('/settings',
  authenticateToken,
  validateRequest(accessibilitySettingsSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = await getUserId(req.user!.uid);
      const settings = await accessibilityService.updateSettings(userId, req.body);
      
      res.json({
        success: true,
        data: settings,
        message: 'Accessibility settings updated successfully'
      });
    } catch (error) {
      console.error('Update accessibility settings error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update accessibility settings'
      });
    }
  }
);

export default router;