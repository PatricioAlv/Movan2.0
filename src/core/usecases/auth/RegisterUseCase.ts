import type { IAuthRepository } from '@core/repositories/IAuthRepository';
import { User } from '@core/entities/User';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class RegisterUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(email: string, password: string, name: string): Promise<User> {
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    return await this.authRepository.register(email, password, name);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
