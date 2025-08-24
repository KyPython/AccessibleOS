import { Request, Response, NextFunction } from 'express';
let auth: any;
try {
  // Lazy import firebase auth if available
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  auth = require('../config/firebase').auth;
} catch (e) {
  auth = null;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // Development / local stub: accept demo token or no token
    const authStubEnabled = process.env.AUTH_STUB === 'true' || process.env.NODE_ENV !== 'production';

    if (!token && !authStubEnabled) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    if (authStubEnabled) {
      // If a token is provided and starts with 'demo-', use the whole token as uid
      // (e.g. 'demo-user' or 'demo-123') so callers can rely on predictable ids.
      const demoUid = token && token.startsWith('demo-') ? token : 'demo-user';
      req.user = {
        uid: demoUid,
        email: 'demo@accessibleos.com',
        name: 'Demo User'
      };
      return next();
    }

    if (!auth) {
      return res.status(500).json({ success: false, error: 'Auth not configured on server' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};