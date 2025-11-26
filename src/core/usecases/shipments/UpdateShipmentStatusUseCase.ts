import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { ShipmentStatus } from '@core/entities/Order';

@injectable()
export class UpdateShipmentStatusUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository
  ) {}

  async execute(shipmentId: string, status: ShipmentStatus, driverId?: string): Promise<void> {
    if (!shipmentId) {
      throw new Error('ID del pedido es requerido');
    }

    if (!status) {
      throw new Error('Estado es requerido');
    }

    try {
      // Verificar que el pedido existe
      const shipment = await this.shipmentRepository.getShipmentById(shipmentId);
      
      if (!shipment) {
        throw new Error('El pedido no existe');
      }

      // Si se proporciona driverId, verificar que el pedido pertenece al transportista
      if (driverId && shipment.driverId !== driverId) {
        throw new Error('No tienes permiso para actualizar este pedido');
      }

      // Validar la transición de estado
      this.validateStatusTransition(shipment.status, status);

      // Actualizar el estado
      await this.shipmentRepository.updateShipmentStatus(shipmentId, status);
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error instanceof Error ? error : new Error('No se pudo actualizar el estado del pedido');
    }
  }

  private validateStatusTransition(currentStatus: ShipmentStatus, newStatus: ShipmentStatus): void {
    const validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
      [ShipmentStatus.PENDING]: [ShipmentStatus.ACCEPTED, ShipmentStatus.CANCELLED],
      [ShipmentStatus.ACCEPTED]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.CANCELLED],
      [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED],
      [ShipmentStatus.DELIVERED]: [],
      [ShipmentStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`No se puede cambiar de ${currentStatus} a ${newStatus}`);
    }
  }
}
