import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';

@injectable()
export class CancelShipmentUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Shipment ID is required');
    }

    await this.shipmentRepository.cancelShipment(id);
  }
}
