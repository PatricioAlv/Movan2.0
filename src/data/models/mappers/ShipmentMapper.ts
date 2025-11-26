import { Shipment, ShipmentStatus, CargoType, Location } from '@core/entities/Order';

export interface ShipmentModel {
  id: string;
  clientId: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverEmail?: string;
  origin: Location;
  destination: Location;
  cargoType: CargoType;
  cargoDescription: string;
  weight: number;
  price: number;
  status: ShipmentStatus;
  pickupDate: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export class ShipmentMapper {
  static toDomain(model: ShipmentModel): Shipment {
    return {
      id: model.id,
      clientId: model.clientId,
      driverId: model.driverId,
      driverName: model.driverName,
      driverPhone: model.driverPhone,
      driverEmail: model.driverEmail,
      origin: model.origin,
      destination: model.destination,
      cargoType: model.cargoType,
      cargoDescription: model.cargoDescription,
      weight: model.weight,
      price: model.price,
      status: model.status,
      pickupDate: new Date(model.pickupDate),
      deliveryDate: model.deliveryDate ? new Date(model.deliveryDate) : undefined,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
      notes: model.notes,
    };
  }

  static toModel(domain: Shipment): ShipmentModel {
    return {
      id: domain.id,
      clientId: domain.clientId,
      driverId: domain.driverId,
      driverName: domain.driverName,
      driverPhone: domain.driverPhone,
      driverEmail: domain.driverEmail,
      origin: domain.origin,
      destination: domain.destination,
      cargoType: domain.cargoType,
      cargoDescription: domain.cargoDescription,
      weight: domain.weight,
      price: domain.price,
      status: domain.status,
      pickupDate: domain.pickupDate.toISOString(),
      deliveryDate: domain.deliveryDate?.toISOString(),
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
      notes: domain.notes,
    };
  }
}
