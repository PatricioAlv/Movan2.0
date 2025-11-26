import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';

@injectable()
export class AcceptShipmentUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(shipmentId: string, driverId: string): Promise<void> {
    if (!shipmentId) {
      throw new Error('ID del pedido es requerido');
    }

    if (!driverId) {
      throw new Error('ID del transportista es requerido');
    }

    try {
      // Verificar que el pedido existe y está disponible
      const shipment = await this.shipmentRepository.getShipmentById(shipmentId);
      
      if (!shipment) {
        throw new Error('El pedido no existe');
      }

      if (shipment.status !== 'PENDING') {
        throw new Error('El pedido ya no está disponible');
      }

      if (shipment.driverId) {
        throw new Error('El pedido ya fue asignado a otro transportista');
      }

      // Aceptar el pedido
      await this.shipmentRepository.acceptShipment(shipmentId, driverId);
    } catch (error) {
      console.error('Error accepting shipment:', error);
      throw error instanceof Error ? error : new Error('No se pudo aceptar el pedido');
    }
  }
}
