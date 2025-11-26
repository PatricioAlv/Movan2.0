import { injectable, inject } from 'inversify';
import { IUserRepository, UpdateUserData } from '@core/repositories/IUserRepository';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(userId: string, data: UpdateUserData): Promise<void> {
    if (data.name && data.name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (data.phone && !/^\d{10}$/.test(data.phone.replace(/\s/g, ''))) {
      throw new Error('El teléfono debe tener 10 dígitos');
    }

    await this.userRepository.updateUser(userId, data);
  }
}
