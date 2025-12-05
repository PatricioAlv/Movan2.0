import * as admin from "firebase-admin";

interface CreateShipmentData {
  clientId: string;
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
  pickupDate: string | Date;
  notes?: string;
}

export async function createShipment(data: CreateShipmentData) {
  const {clientId, origin, destination, cargoType, cargoDescription, weight, price, pickupDate, notes} = data;

  if (!clientId) {
    throw {code: "missing-client-id", message: "El ID del cliente es requerido"};
  }
  if (!origin || !origin.address) {
    throw {code: "missing-origin", message: "La dirección de origen es requerida"};
  }
  if (!destination || !destination.address) {
    throw {code: "missing-destination", message: "La dirección de destino es requerida"};
  }
  if (!cargoDescription) {
    throw {code: "missing-cargo-description", message: "La descripción de la carga es requerida"};
  }
  if (!weight || weight <= 0) {
    throw {code: "invalid-weight", message: "El peso debe ser mayor a 0"};
  }

  const now = Date.now();
  const shipmentsRef = admin.database().ref("shipments");
  const newShipmentRef = shipmentsRef.push();

  const shipment = {
    clientId,
    origin,
    destination,
    cargoType: cargoType || "GENERAL",
    cargoDescription,
    weight,
    price: price || 0,
    pickupDate: typeof pickupDate === "string" ? pickupDate : new Date(pickupDate).toISOString(),
    notes: notes || null,
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  };

  await newShipmentRef.set(shipment);

  return {
    success: true,
    shipmentId: newShipmentRef.key,
    message: "Envío creado correctamente",
  };
}
