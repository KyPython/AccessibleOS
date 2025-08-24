import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { UserService } from '../services/userService';

const router = express.Router();
const userService = new UserService();

// Dev-only endpoint to reset demo data for a user. Guarded by environment.
router.post('/demo-reset', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    const allowed = process.env.ENABLE_DEMO_SEED === 'true' || process.env.AUTH_STUB === 'true' || !isProduction;
    if (!allowed) {
      return res.status(403).json({ success: false, error: 'Demo reset disabled in this environment' });
    }

    const firebaseUid = (req.body.firebaseUid as string) || req.user!.uid;
    if (!firebaseUid) {
      return res.status(400).json({ success: false, error: 'firebaseUid required' });
    }

    const user = await userService.getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await userService.resetDemoForUser(user.id);

    return res.json({ success: true, message: 'Demo data reset' });
  } catch (err) {
    console.error('Demo reset error', err);
    return res.status(500).json({ success: false, error: 'Failed to reset demo data' });
  }
});

export default router;
