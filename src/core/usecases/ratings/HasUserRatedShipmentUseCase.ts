import { inject, injectable } from 'inversify';
import type { IRatingRepository } from '../../../repositories/IRatingRepository';
import { TYPES } from '../../../../infrastructure/di/types';

@injectable()
export class HasUserRatedShipmentUseCase {
  constructor(
    @inject(TYPES.RatingRepository)
    private ratingRepository: IRatingRepository
  ) {}

  async execute(userId: string, shipmentId: string): Promise<boolean> {
    return await this.ratingRepository.hasUserRatedShipment(userId, shipmentId);
  }
}
