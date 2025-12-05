import * as admin from 'firebase-admin';

export interface AcceptShipmentResult {
  success: boolean;
  shipmentId: string;
  driverId: string;
  newStatus: string;
}

export async function acceptShipment(shipmentId: string, driverId: string): Promise<AcceptShipmentResult> {
  if (!shipmentId) {
    throw { code: 'missing-shipment-id', message: 'El ID del envío es requerido' };
  }

  if (!driverId) {
    throw { code: 'missing-driver-id', message: 'El ID del conductor es requerido' };
  }

  const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
  const snapshot = await shipmentRef.get();

  if (!snapshot.exists()) {
    throw { code: 'not-found', message: 'Envío no encontrado' };
  }

  const shipmentData = snapshot.val();

  // Validar que el envío esté pendiente
  if (shipmentData.status !== 'PENDING') {
    throw { code: 'invalid-status', message: 'El envío ya no está disponible para aceptar' };
  }

  // Validar que no tenga conductor asignado
  if (shipmentData.driverId) {
    throw { code: 'already-assigned', message: 'El envío ya fue asignado a otro conductor' };
  }

  // Actualizar el envío
  const newStatus = 'ACCEPTED';
  await shipmentRef.update({
    status: newStatus,
    driverId: driverId,
    acceptedAt: Date.now(),
    updatedAt: Date.now(),
  });

  return {
    success: true,
    shipmentId,
    driverId,
    newStatus,
  };
}
