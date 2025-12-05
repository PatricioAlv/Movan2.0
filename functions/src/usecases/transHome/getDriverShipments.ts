import * as admin from 'firebase-admin';

export interface DriverShipment {
  id: string;
  status: string;
  origin: {
    address: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    address: string;
    latitude: number;
    longitude: number;
  };
  cargoDescription: string;
  pickupDate: number;
  clientId: string;
  driverId: string;
  createdAt: number;
  updatedAt?: number;
}

export async function getDriverShipments(driverId: string): Promise<DriverShipment[]> {
  if (!driverId) {
    throw { code: 'missing-driver-id', message: 'El ID del conductor es requerido' };
  }

  const shipmentsRef = admin.database().ref('shipments');
  const snapshot = await shipmentsRef
    .orderByChild('driverId')
    .equalTo(driverId)
    .get();

  if (!snapshot.exists()) {
    return [];
  }

  const shipments: DriverShipment[] = [];
  
  snapshot.forEach((childSnapshot) => {
    const data = childSnapshot.val();
    shipments.push({
      id: childSnapshot.key as string,
      status: data.status,
      origin: data.origin,
      destination: data.destination,
      cargoDescription: data.cargoDescription,
      pickupDate: data.pickupDate,
      clientId: data.clientId,
      driverId: data.driverId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  });

  // Ordenar por fecha de creación (más recientes primero)
  return shipments.sort((a, b) => b.createdAt - a.createdAt);
}
