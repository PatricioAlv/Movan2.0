export enum ShipmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum CargoType {
  GENERAL = 'GENERAL',
  FRAGILE = 'FRAGILE',
  PERISHABLE = 'PERISHABLE',
  HAZARDOUS = 'HAZARDOUS',
  HEAVY = 'HEAVY',
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
}

export interface Shipment {
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
  pickupDate: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  clientRating?: {
    rating: number;
    comment?: string;
    createdAt: Date;
  };
  driverRating?: {
    rating: number;
    comment?: string;
    createdAt: Date;
  };
}

export interface CreateShipmentData {
  origin: Location;
  destination: Location;
  cargoType: CargoType;
  cargoDescription: string;
  weight: number;
  price: number;
  pickupDate: Date;
  notes?: string;
}
