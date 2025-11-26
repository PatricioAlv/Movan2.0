import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { Shipment } from '@core/entities/Order';

@injectable()
export class GetDriverShipmentsUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(driverId: string): Promise<Shipment[]> {
    if (!driverId) {
      throw new Error('ID del transportista es requerido');
    }

    try {
      const shipments = await this.shipmentRepository.getDriverShipments(driverId);
      // Ordenar por fecha de actualización (más recientes primero)
      return shipments.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error) {
      console.error('Error getting driver shipments:', error);
      throw new Error('No se pudieron obtener los pedidos del transportista');
    }
  }
}
