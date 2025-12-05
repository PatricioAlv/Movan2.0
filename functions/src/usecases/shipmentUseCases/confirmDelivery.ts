import * as admin from 'firebase-admin';

const ShipmentStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export async function confirmDelivery(shipmentId: string, driverId?: string) {
  if (!shipmentId) {
    throw { code: 'missing-shipment-id', message: 'El ID de envío es requerido' };
  }

  const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
  const snapshot = await shipmentRef.get();

  if (!snapshot.exists()) {
    throw { code: 'not-found', message: 'Envío no encontrado' };
  }

  const shipment = snapshot.val();

  // Si se proporciona driverId, verificar que el envío pertenece al transportista
  if (driverId && shipment.driverId !== driverId) {
    throw { code: 'permission-denied', message: 'No tienes permiso para actualizar este envío' };
  }

  // Validar que el estado actual sea IN_TRANSIT
  if (shipment.status !== ShipmentStatus.IN_TRANSIT) {
    throw { 
      code: 'invalid-status-transition', 
      message: `No se puede confirmar la entrega desde el estado ${shipment.status}. El envío debe estar en tránsito.` 
    };
  }

  await shipmentRef.update({ 
    status: ShipmentStatus.DELIVERED, 
    deliveryDate: Date.now(),
    updatedAt: Date.now() 
  });

  return { 
    success: true, 
    shipmentId,
    newStatus: ShipmentStatus.DELIVERED,
    message: 'Envío marcado como entregado'
  };
}
