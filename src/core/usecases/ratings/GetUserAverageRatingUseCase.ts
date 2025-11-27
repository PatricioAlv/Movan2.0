import { inject, injectable } from 'inversify';
import type { IRatingRepository } from '../../../repositories/IRatingRepository';
import { TYPES } from '../../../../infrastructure/di/types';

@injectable()
export class GetUserAverageRatingUseCase {
  constructor(
    @inject(TYPES.RatingRepository)
    private ratingRepository: IRatingRepository
  ) {}

  async execute(userId: string): Promise<{ average: number; total: number }> {
    return await this.ratingRepository.getUserAverageRating(userId);
  }
}
