import { UserService } from '../../services/userService';
import { query } from '../../config/database';

jest.mock('../../config/database', () => ({
  query: jest.fn()
}));

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
    process.env.AUTH_STUB = 'true';
  });

  it('should delete demo data when resetDemoForUser is called', async () => {
    mockQuery.mockResolvedValue({ rows: [] } as any);

    await userService.resetDemoForUser('user-123');

    // Expect a sequence of delete calls including tasks and user
    expect(mockQuery).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenLastCalledWith('DELETE FROM users WHERE id = $1', ['user-123']);
  });

  it('should forbid reset when disabled', async () => {
    process.env.NODE_ENV = 'production';
  process.env.ENABLE_DEMO_SEED = 'false';
  process.env.AUTH_STUB = 'false';

    await expect(userService.resetDemoForUser('user-123')).rejects.toThrow('Demo reset is disabled');
  });
});
