import { injectable, inject } from 'inversify';
import { IUserRepository } from '@core/repositories/IUserRepository';
import { User } from '@core/entities/User';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class GetUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<User | null> {
    return await this.userRepository.getUserById(userId);
  }
}
