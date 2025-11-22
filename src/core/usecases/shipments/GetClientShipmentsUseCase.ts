import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { Shipment } from '@core/entities/Order';

@injectable()
export class GetClientShipmentsUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(clientId: string): Promise<Shipment[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    return await this.shipmentRepository.getClientShipments(clientId);
  }
}
