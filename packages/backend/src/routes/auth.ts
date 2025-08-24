import express from 'express';
import { UserService } from '../services/userService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { validateRequest, userSyncSchema, userUpdateSchema } from '../middleware/validation';

const router = express.Router();
const userService = new UserService();

// Sync user data from Firebase
router.post('/sync', 
  authenticateToken,
  validateRequest(userSyncSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = await userService.syncUser(req.body);
      
      res.json({
        success: true,
        data: user,
        message: 'User synchronized successfully'
      });
    } catch (error) {
      console.error('User sync error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync user data'
      });
    }
  }
);

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await userService.getUserByFirebaseUid(req.user!.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile',
  authenticateToken,
  validateRequest(userUpdateSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = await userService.getUserByFirebaseUid(req.user!.uid);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const updatedUser = await userService.updateUser(user.id, req.body);
      
      res.json({
        success: true,
        data: updatedUser,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }
);

export default router;