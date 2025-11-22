import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { Shipment, CreateShipmentData } from '@core/entities/Order';

@injectable()
export class CreateShipmentUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(clientId: string, data: CreateShipmentData): Promise<Shipment> {
    if (!data.origin || !data.destination) {
      throw new Error('Origin and destination are required');
    }

    if (data.weight <= 0) {
      throw new Error('Weight must be greater than 0');
    }

    if (data.price < 0) {
      throw new Error('Price must be non-negative');
    }

    if (!data.cargoDescription.trim()) {
      throw new Error('Cargo description is required');
    }

    return await this.shipmentRepository.createShipment(clientId, data);
  }
}
