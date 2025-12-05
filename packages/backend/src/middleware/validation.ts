import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(detail => detail.message),
      });
    }
    
    next();
  };
};

// User validation schemas
export const userSyncSchema = Joi.object({
  id: Joi.string().required(),
  firebaseUid: Joi.string().required(),
  email: Joi.string().email().required(),
  displayName: Joi.string().optional(),
  profilePictureUrl: Joi.string().uri().optional(),
  createdAt: Joi.string().isoDate().required(),
  updatedAt: Joi.string().isoDate().required(),
  lastLogin: Joi.string().isoDate().optional(),
  isActive: Joi.boolean().required(),
});

export const userUpdateSchema = Joi.object({
  displayName: Joi.string().optional(),
  profilePictureUrl: Joi.string().uri().optional(),
});

// Task validation schemas
export const taskCreateSchema = Joi.object({
  title: Joi.string().min(1).max(500).required(),
  description: Joi.string().max(2000).optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  dueDate: Joi.string().isoDate().optional(),
  estimatedDuration: Joi.number().integer().min(1).optional(),
  tags: Joi.array().items(Joi.string().max(50)).default([]),
  categoryIds: Joi.array().items(Joi.string().uuid()).default([]),
  parentTaskId: Joi.string().uuid().optional(),
});

export const taskUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(500).optional(),
  description: Joi.string().max(2000).optional(),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  dueDate: Joi.string().isoDate().allow(null).optional(),
  completedAt: Joi.string().isoDate().allow(null).optional(),
  estimatedDuration: Joi.number().integer().min(1).allow(null).optional(),
  actualDuration: Joi.number().integer().min(1).allow(null).optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  categoryIds: Joi.array().items(Joi.string().uuid()).optional(),
  parentTaskId: Joi.string().uuid().allow(null).optional(),
  sortOrder: Joi.number().integer().optional(),
});

// Task category validation schemas
export const categoryCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  icon: Joi.string().max(50).optional(),
});

export const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  icon: Joi.string().max(50).optional(),
});

// Accessibility settings validation schema
export const accessibilitySettingsSchema = Joi.object({
  voiceOverEnabled: Joi.boolean().optional(),
  voiceOverSpeed: Joi.number().min(0.5).max(2.0).optional(),
  keyboardNavigationEnabled: Joi.boolean().optional(),
  highContrastMode: Joi.boolean().optional(),
  fontSizeMultiplier: Joi.number().min(0.8).max(2.0).optional(),
  screenReaderEnabled: Joi.boolean().optional(),
  motionReduced: Joi.boolean().optional(),
  colorBlindMode: Joi.string().valid('protanopia', 'deuteranopia', 'tritanopia').allow(null).optional(),
  customCss: Joi.string().max(5000).optional(),
});