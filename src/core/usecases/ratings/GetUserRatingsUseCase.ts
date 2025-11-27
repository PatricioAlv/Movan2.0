import { inject, injectable } from 'inversify';
import type { Rating } from '../../../entities/Rating';
import type { IRatingRepository } from '../../../repositories/IRatingRepository';
import { TYPES } from '../../../../infrastructure/di/types';

@injectable()
export class GetUserRatingsUseCase {
  constructor(
    @inject(TYPES.RatingRepository)
    private ratingRepository: IRatingRepository
  ) {}

  async execute(userId: string): Promise<Rating[]> {
    return await this.ratingRepository.getRatingsByUser(userId);
  }
}
