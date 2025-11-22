import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { Shipment } from '@core/entities/Order';

@injectable()
export class GetShipmentByIdUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(id: string): Promise<Shipment | null> {
    if (!id) {
      throw new Error('Shipment ID is required');
    }

    return await this.shipmentRepository.getShipmentById(id);
  }
}
