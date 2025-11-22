import { Shipment, CreateShipmentData } from '../entities/Order';

export interface IShipmentRepository {
  createShipment(clientId: string, data: CreateShipmentData): Promise<Shipment>;
  getShipmentById(id: string): Promise<Shipment | null>;
  getClientShipments(clientId: string): Promise<Shipment[]>;
  updateShipmentStatus(id: string, status: string): Promise<void>;
  cancelShipment(id: string): Promise<void>;
}
