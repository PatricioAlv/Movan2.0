import { injectable } from 'inversify';
import { ref, push, set, get, update, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '@data/config/firebase.config';
import { Shipment, CreateShipmentData, ShipmentStatus } from '@core/entities/Order';
import { ShipmentMapper, ShipmentModel } from '@data/models/mappers/ShipmentMapper';

@injectable()
export class FirebaseShipmentDataSource {
  private shipmentsRef = ref(database, 'shipments');

  async create(clientId: string, data: CreateShipmentData): Promise<Shipment> {
    const newShipmentRef = push(this.shipmentsRef);
    const shipmentId = newShipmentRef.key!;

    const now = new Date();
    const shipmentModel: ShipmentModel = {
      id: shipmentId,
      clientId,
      origin: data.origin,
      destination: data.destination,
      cargoType: data.cargoType,
      cargoDescription: data.cargoDescription,
      weight: data.weight,
      price: data.price,
      status: ShipmentStatus.PENDING,
      pickupDate: data.pickupDate.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      notes: data.notes,
    };

    await set(newShipmentRef, shipmentModel);
    return ShipmentMapper.toDomain(shipmentModel);
  }

  async getById(id: string): Promise<Shipment | null> {
    const shipmentRef = ref(database, `shipments/${id}`);
    const snapshot = await get(shipmentRef);

    if (!snapshot.exists()) {
      return null;
    }

    return ShipmentMapper.toDomain(snapshot.val());
  }

  async getByClientId(clientId: string): Promise<Shipment[]> {
    const shipmentsQuery = query(
      this.shipmentsRef,
      orderByChild('clientId'),
      equalTo(clientId)
    );

    const snapshot = await get(shipmentsQuery);

    if (!snapshot.exists()) {
      return [];
    }

    const shipments: Shipment[] = [];
    snapshot.forEach((childSnapshot) => {
      shipments.push(ShipmentMapper.toDomain(childSnapshot.val()));
    });

    return shipments;
  }

  async updateStatus(id: string, status: ShipmentStatus): Promise<void> {
    const shipmentRef = ref(database, `shipments/${id}`);
    await update(shipmentRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  async cancel(id: string): Promise<void> {
    const shipmentRef = ref(database, `shipments/${id}`);
    await update(shipmentRef, {
      status: ShipmentStatus.CANCELLED,
      updatedAt: new Date().toISOString(),
    });
  }
}
