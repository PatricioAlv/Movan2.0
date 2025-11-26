import { Shipment, CreateShipmentData } from '../entities/Order';

export interface IShipmentRepository {
  createShipment(clientId: string, data: CreateShipmentData): Promise<Shipment>;
  getShipmentById(id: string): Promise<Shipment | null>;
  getClientShipments(clientId: string): Promise<Shipment[]>;
  getAvailableShipments(): Promise<Shipment[]>;
  getDriverShipments(driverId: string): Promise<Shipment[]>;
  acceptShipment(shipmentId: string, driverId: string, driverName: string, driverPhone?: string, driverEmail?: string): Promise<void>;
  updateShipmentStatus(id: string, status: string): Promise<void>;
  cancelShipment(id: string): Promise<void>;
}
