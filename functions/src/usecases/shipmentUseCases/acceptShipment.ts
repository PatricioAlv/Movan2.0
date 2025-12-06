import * as admin from "firebase-admin";
import {ServerValue} from "firebase-admin/database";

export async function acceptShipment(shipmentId: string, driverId: string): Promise<any> {
  const db = admin.database();
  const shipmentRef = db.ref(`shipments/${shipmentId}`);

  const snapshot = await shipmentRef.once("value");
  if (!snapshot.exists()) {
    const error = new Error("Envío no encontrado");
    (error as any).code = "not-found";
    throw error;
  }

  const shipment = snapshot.val();

  // Verificar que el envío esté pendiente y sin conductor asignado
  if (shipment.status !== "PENDING") {
    const error = new Error("El envío ya no está disponible para aceptar");
    (error as any).code = "invalid-status";
    throw error;
  }

  if (shipment.driverId) {
    const error = new Error("El envío ya tiene un conductor asignado");
    (error as any).code = "already-assigned";
    throw error;
  }

  // Obtener información del conductor
  const driverRef = db.ref(`users/${driverId}`);
  const driverSnapshot = await driverRef.once("value");
  const driverData = driverSnapshot.val();

  // Actualizar el envío con el conductor asignado
  const updates: any = {
    status: "ACCEPTED",
    driverId: driverId,
    acceptedAt: ServerValue.TIMESTAMP,
    updatedAt: ServerValue.TIMESTAMP,
  };

  // Agregar información del conductor si está disponible
  if (driverData) {
    updates.driverName = driverData.name || null;
    updates.driverEmail = driverData.email || null;
    updates.driverPhone = driverData.phone || null;
  }

  await shipmentRef.update(updates);

  // Retornar el envío actualizado
  const updatedSnapshot = await shipmentRef.once("value");
  return {
    id: shipmentId,
    ...updatedSnapshot.val(),
  };
}
