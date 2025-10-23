import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
