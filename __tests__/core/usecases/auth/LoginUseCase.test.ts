import { LoginUseCase } from '@core/usecases/auth/LoginUseCase';
import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { User } from '@core/entities/User';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
      onAuthStateChanged: jest.fn(),
    };

    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  it('should login successfully with valid credentials', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthRepository.login.mockResolvedValue(mockUser);

    const result = await loginUseCase.execute({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result).toEqual(mockUser);
    expect(mockAuthRepository.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
  });

  it('should throw error with invalid email', async () => {
    await expect(
      loginUseCase.execute({
        email: 'invalid-email',
        password: 'password123',
      })
    ).rejects.toThrow('Invalid email format');
  });

  it('should throw error with empty credentials', async () => {
    await expect(
      loginUseCase.execute({
        email: '',
        password: '',
      })
    ).rejects.toThrow('Email and password are required');
  });
});
