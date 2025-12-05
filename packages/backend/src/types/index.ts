// User types
export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  displayName?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// Task types
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  parentTaskId?: string;
  sortOrder: number;
  categories: TaskCategory[];
}

export interface TaskCategory {
  id: string;
  userId: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// Accessibility types
export interface AccessibilitySettings {
  id: string;
  userId: string;
  voiceOverEnabled: boolean;
  voiceOverSpeed: number;
  keyboardNavigationEnabled: boolean;
  highContrastMode: boolean;
  fontSizeMultiplier: number;
  screenReaderEnabled: boolean;
  motionReduced: boolean;
  colorBlindMode?: 'protanopia' | 'deuteranopia' | 'tritanopia';
  customCss?: string;
  createdAt: string;
  updatedAt: string;
}

// Game types
export interface GameProgress {
  id: string;
  userId: string;
  level: number;
  experiencePoints: number;
  achievements: string[];
  currentStreak: number;
  longestStreak: number;
  tasksCompletedToday: number;
  lastActivityDate: string;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task_reminder' | 'achievement' | 'system';
  isRead: boolean;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}