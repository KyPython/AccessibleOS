// String formatting functions for AccessibleOS
import { TaskStatus, TaskPriority, NotificationType, ColorBlindMode, GameAchievement } from '../types';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatPriority = (priority: TaskPriority): string => {
  const priorityMap = {
    [TaskPriority.LOW]: 'Low Priority',
    [TaskPriority.MEDIUM]: 'Medium Priority', 
    [TaskPriority.HIGH]: 'High Priority',
    [TaskPriority.URGENT]: 'Urgent Priority'
  };
  return priorityMap[priority];
};

export const formatStatus = (status: TaskStatus): string => {
  const statusMap = {
    [TaskStatus.PENDING]: 'Pending',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.COMPLETED]: 'Completed',
    [TaskStatus.CANCELLED]: 'Cancelled'
  };
  return statusMap[status];
};

export const formatGameLevel = (level: number): string => {
  return `Level ${level}`;
};

export const formatExperiencePoints = (points: number): string => {
  return `${points.toLocaleString()} XP`;
};

export const formatStreak = (streak: number): string => {
  return `${streak} day${streak !== 1 ? 's' : ''}`;
};

export const formatAchievement = (achievement: GameAchievement): string => {
  const achievementMap = {
    [GameAchievement.FIRST_TASK]: 'First Task Completed',
    [GameAchievement.EARLY_BIRD]: 'Early Bird',
    [GameAchievement.STREAK_MASTER]: 'Streak Master',
    [GameAchievement.COMPLETIONIST]: 'Completionist',
    [GameAchievement.ACCESSIBILITY_CHAMPION]: 'Accessibility Champion'
  };
  return achievementMap[achievement];
};

export const formatNotificationType = (type: NotificationType): string => {
  const typeMap = {
    [NotificationType.TASK_REMINDER]: 'Task Reminder',
    [NotificationType.ACHIEVEMENT]: 'Achievement',
    [NotificationType.SYSTEM]: 'System Notification'
  };
  return typeMap[type];
};

export const formatColorBlindMode = (mode: ColorBlindMode): string => {
  const modeMap = {
    [ColorBlindMode.PROTANOPIA]: 'Protanopia Support',
    [ColorBlindMode.DEUTERANOPIA]: 'Deuteranopia Support',
    [ColorBlindMode.TRITANOPIA]: 'Tritanopia Support'
  };
  return modeMap[mode];
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};