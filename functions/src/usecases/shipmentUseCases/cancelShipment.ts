import * as admin from 'firebase-admin';

export async function cancelShipment(shipmentId: string) {
  if (!shipmentId) {
    throw { code: 'missing-shipment-id', message: 'El ID de envío es requerido' };
  }

  const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
  const snapshot = await shipmentRef.get();

  if (!snapshot.exists()) {
    throw { code: 'not-found', message: 'Envío no encontrado' };
  }

  await shipmentRef.update({ status: 'CANCELLED', updatedAt: Date.now() });

  return { success: true, shipmentId };
}