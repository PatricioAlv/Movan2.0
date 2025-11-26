import { inject, injectable } from 'inversify';
import { TYPES } from '@infrastructure/di/types';
import type { IShipmentRepository } from '@core/repositories/IShipmentRepository';
import { Shipment, CreateShipmentData, ShipmentStatus } from '@core/entities/Order';
import { FirebaseShipmentDataSource } from '@data/datasources/remote/FirebaseShipmentDataSource';

@injectable()
export class FirebaseShipmentRepository implements IShipmentRepository {
  constructor(
    @inject(TYPES.FirebaseShipmentDataSource)
    private dataSource: FirebaseShipmentDataSource
  ) {}

  async createShipment(clientId: string, data: CreateShipmentData): Promise<Shipment> {
    return await this.dataSource.create(clientId, data);
  }

  async getShipmentById(id: string): Promise<Shipment | null> {
    return await this.dataSource.getById(id);
  }

  async getClientShipments(clientId: string): Promise<Shipment[]> {
    return await this.dataSource.getByClientId(clientId);
  }

  async updateShipmentStatus(id: string, status: string): Promise<void> {
    await this.dataSource.updateStatus(id, status as ShipmentStatus);
  }

  async cancelShipment(id: string): Promise<void> {
    await this.dataSource.cancel(id);
  }

  async getAvailableShipments(): Promise<Shipment[]> {
    return await this.dataSource.getByStatus(ShipmentStatus.PENDING);
  }

  async getDriverShipments(driverId: string): Promise<Shipment[]> {
    return await this.dataSource.getByDriverId(driverId);
  }

  async acceptShipment(shipmentId: string, driverId: string): Promise<void> {
    await this.dataSource.assignDriver(shipmentId, driverId);
  }
}
