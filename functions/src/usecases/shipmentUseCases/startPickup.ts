import * as admin from 'firebase-admin';

const ShipmentStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export async function startPickup(shipmentId: string, driverId?: string) {
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

  // Validar que el estado actual sea ACCEPTED
  if (shipment.status !== ShipmentStatus.ACCEPTED) {
    throw { 
      code: 'invalid-status-transition', 
      message: `No se puede iniciar el viaje desde el estado ${shipment.status}. El envío debe estar en estado ACCEPTED.` 
    };
  }

  await shipmentRef.update({ 
    status: ShipmentStatus.IN_TRANSIT, 
    updatedAt: Date.now() 
  });

  return { 
    success: true, 
    shipmentId,
    newStatus: ShipmentStatus.IN_TRANSIT,
    message: 'Viaje iniciado. Dirígete a recoger el pedido.'
  };
}
