import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { Shipment } from '@core/entities/Order';

@injectable()
export class GetAvailableShipmentsUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(): Promise<Shipment[]> {
    try {
      const shipments = await this.shipmentRepository.getAvailableShipments();
      // Ordenar por fecha de creación (más recientes primero)
      return shipments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting available shipments:', error);
      throw new Error('No se pudieron obtener los pedidos disponibles');
    }
  }
}
