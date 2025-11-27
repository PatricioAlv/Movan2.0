import { inject, injectable } from 'inversify';
import type { Rating, CreateRatingData } from '../../../entities/Rating';
import type { IRatingRepository } from '../../../repositories/IRatingRepository';
import { TYPES } from '../../../../infrastructure/di/types';

@injectable()
export class CreateRatingUseCase {
  constructor(
    @inject(TYPES.RatingRepository)
    private ratingRepository: IRatingRepository
  ) {}

  async execute(fromUserId: string, data: CreateRatingData): Promise<Rating> {
    return await this.ratingRepository.createRating(fromUserId, data);
  }
}
