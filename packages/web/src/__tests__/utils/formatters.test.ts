import {
  formatTaskStatus,
  formatTaskPriority,
  formatDate,
  formatDateTime,
  formatDuration,
  formatRelativeTime,
  formatPercentage
} from '../../utils/formatters';
import { TaskStatus, TaskPriority } from '../../types';

describe('formatters', () => {
  describe('formatTaskStatus', () => {
    it('formats task statuses correctly', () => {
      expect(formatTaskStatus(TaskStatus.PENDING)).toBe('Pending');
      expect(formatTaskStatus(TaskStatus.IN_PROGRESS)).toBe('In Progress');
      expect(formatTaskStatus(TaskStatus.COMPLETED)).toBe('Completed');
      expect(formatTaskStatus(TaskStatus.CANCELLED)).toBe('Cancelled');
    });
  });

  describe('formatTaskPriority', () => {
    it('formats task priorities correctly', () => {
      expect(formatTaskPriority(TaskPriority.LOW)).toBe('Low Priority');
      expect(formatTaskPriority(TaskPriority.MEDIUM)).toBe('Medium Priority');
      expect(formatTaskPriority(TaskPriority.HIGH)).toBe('High Priority');
      expect(formatTaskPriority(TaskPriority.URGENT)).toBe('Urgent');
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const dateString = '2024-01-20T10:00:00Z';
      const result = formatDate(dateString);
      expect(result).toMatch(/Jan 20, 2024/);
    });

    it('formats Date object correctly', () => {
      const date = new Date('2024-01-20T10:00:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/Jan 20, 2024/);
    });
  });

  describe('formatDateTime', () => {
    it('formats datetime string correctly', () => {
      const dateString = '2024-01-20T10:30:00Z';
      const result = formatDateTime(dateString);
      expect(result).toMatch(/Jan 20, 2024/);
      expect(result).toMatch(/10:30/);
    });
  });

  describe('formatDuration', () => {
    it('formats minutes correctly', () => {
      expect(formatDuration(30)).toBe('30min');
      expect(formatDuration(45)).toBe('45min');
    });

    it('formats hours and minutes correctly', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(90)).toBe('1h 30min');
      expect(formatDuration(120)).toBe('2h');
      expect(formatDuration(150)).toBe('2h 30min');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock current time to 2024-01-20T12:00:00Z
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-20T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('formats recent times correctly', () => {
      // 30 seconds ago
      const thirtySecondsAgo = new Date('2024-01-20T11:59:30Z');
      expect(formatRelativeTime(thirtySecondsAgo)).toBe('Just now');

      // 5 minutes ago
      const fiveMinutesAgo = new Date('2024-01-20T11:55:00Z');
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');

      // 2 hours ago
      const twoHoursAgo = new Date('2024-01-20T10:00:00Z');
      expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');

      // 1 day ago
      const oneDayAgo = new Date('2024-01-19T12:00:00Z');
      expect(formatRelativeTime(oneDayAgo)).toBe('1d ago');
    });

    it('formats old dates with full date', () => {
      // 2 months ago
      const twoMonthsAgo = new Date('2023-11-20T12:00:00Z');
      const result = formatRelativeTime(twoMonthsAgo);
      expect(result).toMatch(/Nov 20, 2023/);
    });
  });

  describe('formatPercentage', () => {
    it('formats percentages correctly', () => {
      expect(formatPercentage(5, 10)).toBe('50%');
      expect(formatPercentage(3, 4)).toBe('75%');
      expect(formatPercentage(1, 3)).toBe('33%');
    });

    it('handles zero total', () => {
      expect(formatPercentage(5, 0)).toBe('0%');
    });

    it('handles zero value', () => {
      expect(formatPercentage(0, 10)).toBe('0%');
    });
  });
});