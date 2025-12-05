import { Request, Response } from 'express';
import { TaskController } from '../controllers/TaskController';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

describe('TaskController', () => {
  let taskController: TaskController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockPrisma: any;

  beforeEach(() => {
    taskController = new TaskController();
    mockPrisma = new PrismaClient();

    mockRequest = {
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should return error when hasMedia is true but altText is missing', async () => {
      mockRequest.body = {
        title: 'Test Task',
        hasMedia: true,
        altText: '', // Empty altText
      };

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Accessibility violation',
        message: 'altText is required when hasMedia is true',
      });
      expect(mockPrisma.task.create).not.toHaveBeenCalled();
    });

    it('should create task successfully when hasMedia is false', async () => {
      const mockTask = {
        id: '123',
        title: 'Test Task',
        description: null,
        status: 'PENDING',
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        altText: null,
        hasMedia: false,
        labels: [],
      };

      mockRequest.body = {
        title: 'Test Task',
        hasMedia: false,
      };

      (mockPrisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockTask });
      expect(mockPrisma.task.create).toHaveBeenCalled();
    });

    it('should create task successfully when hasMedia is true and altText is provided', async () => {
      const mockTask = {
        id: '123',
        title: 'Test Task',
        description: null,
        status: 'PENDING',
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        altText: 'A descriptive alt text',
        hasMedia: true,
        labels: [],
      };

      mockRequest.body = {
        title: 'Test Task',
        hasMedia: true,
        altText: 'A descriptive alt text',
      };

      (mockPrisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: mockTask });
      expect(mockPrisma.task.create).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should return error when updating task with hasMedia true but missing altText', async () => {
      const existingTask = {
        id: '123',
        title: 'Existing Task',
        hasMedia: false,
        altText: null,
      };

      mockRequest.params = { id: '123' };
      mockRequest.body = {
        hasMedia: true,
        altText: '', // Empty altText
      };

      (mockPrisma.task.findUnique as jest.Mock).mockResolvedValue(existingTask);

      await taskController.updateTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Accessibility violation',
        message: 'altText is required when hasMedia is true',
      });
      expect(mockPrisma.task.update).not.toHaveBeenCalled();
    });
  });
});

