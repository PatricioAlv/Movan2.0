import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import type { IUserRepository } from '@core/repositories/IUserRepository';

@injectable()
export class AcceptShipmentUseCase {
  constructor(
    @inject(TYPES.IShipmentRepository)
    private shipmentRepository: IShipmentRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
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

      // Obtener datos del transportista
      const driver = await this.userRepository.getUserById(driverId);
      
      if (!driver) {
        throw new Error('No se encontró el transportista');
      }

      // Aceptar el pedido con los datos del transportista
      await this.shipmentRepository.acceptShipment(
        shipmentId, 
        driverId,
        driver.name,
        driver.phone,
        driver.email
      );
    } catch (error) {
      console.error('Error accepting shipment:', error);
      throw error instanceof Error ? error : new Error('No se pudo aceptar el pedido');
    }
  }
}
