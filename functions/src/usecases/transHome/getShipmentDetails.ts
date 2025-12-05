import * as admin from 'firebase-admin';

export interface ShipmentDetails {
  id: string;
  status: string;
  origin: {
    address: string;
    latitude: number;
    longitude: number;
    contactName?: string;
    contactPhone?: string;
  };
  destination: {
    address: string;
    latitude: number;
    longitude: number;
    contactName?: string;
    contactPhone?: string;
  };
  cargoType: string;
  cargoDescription: string;
  weight: number;
  price: number;
  pickupDate: number;
  deliveryDate?: number;
  clientId: string;
  driverId?: string;
  createdAt: number;
  updatedAt?: number;
  client?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    averageRating?: number;
    totalRatings?: number;
  };
}

export async function getShipmentDetails(shipmentId: string): Promise<ShipmentDetails> {
  if (!shipmentId) {
    throw { code: 'missing-shipment-id', message: 'El ID del envío es requerido' };
  }

  // Obtener datos del envío
  const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
  const shipmentSnapshot = await shipmentRef.get();

  if (!shipmentSnapshot.exists()) {
    throw { code: 'not-found', message: 'Envío no encontrado' };
  }

  const shipmentData = shipmentSnapshot.val();

  // Construir objeto de respuesta
  const shipmentDetails: ShipmentDetails = {
    id: shipmentId,
    status: shipmentData.status,
    origin: shipmentData.origin,
    destination: shipmentData.destination,
    cargoType: shipmentData.cargoType,
    cargoDescription: shipmentData.cargoDescription,
    weight: shipmentData.weight,
    price: shipmentData.price,
    pickupDate: shipmentData.pickupDate,
    deliveryDate: shipmentData.deliveryDate,
    clientId: shipmentData.clientId,
    driverId: shipmentData.driverId,
    createdAt: shipmentData.createdAt,
    updatedAt: shipmentData.updatedAt,
  };

  // Obtener datos del cliente si existe
  if (shipmentData.clientId) {
    try {
      const userRef = admin.database().ref(`users/${shipmentData.clientId}`);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        shipmentDetails.client = {
          id: shipmentData.clientId,
          name: userData.name || 'Cliente',
          email: userData.email,
          phone: userData.phone,
          averageRating: userData.averageRating,
          totalRatings: userData.totalRatings,
        };
      }
    } catch (error) {
      console.error('Error loading client data:', error);
      // No lanzamos error, solo omitimos los datos del cliente
    }
  }

  return shipmentDetails;
}
