import * as admin from "firebase-admin";

const ShipmentStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export async function updateShipmentStatus(shipmentId: string, status: string, driverId?: string) {
  if (!shipmentId) {
    throw {code: "missing-shipment-id", message: "El ID de envío es requerido"};
  }
  if (!status) {
    throw {code: "missing-status", message: "El estado es requerido"};
  }

  const validStatuses = Object.values(ShipmentStatus);
  if (!validStatuses.includes(status)) {
    throw {code: "invalid-status", message: `Estado inválido. Valores válidos: ${validStatuses.join(", ")}`};
  }

  const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
  const snapshot = await shipmentRef.get();

  if (!snapshot.exists()) {
    throw {code: "not-found", message: "Envío no encontrado"};
  }

  const shipment = snapshot.val();

  // Si se proporciona driverId, verificar que el envío pertenece al transportista
  if (driverId && shipment.driverId && shipment.driverId !== driverId) {
    throw {code: "permission-denied", message: "No tienes permiso para actualizar este envío"};
  }

  // Validar transición de estado
  const validTransitions: Record<string, string[]> = {
    [ShipmentStatus.PENDING]: [ShipmentStatus.ACCEPTED, ShipmentStatus.CANCELLED],
    [ShipmentStatus.ACCEPTED]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.CANCELLED],
    [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED],
    [ShipmentStatus.DELIVERED]: [],
    [ShipmentStatus.CANCELLED]: [],
  };

  if (!validTransitions[shipment.status]?.includes(status)) {
    throw {
      code: "invalid-status-transition",
      message: `No se puede cambiar de ${shipment.status} a ${status}`,
    };
  }

  const updateData: any = {
    status,
    updatedAt: Date.now(),
  };

  // Si se marca como entregado, agregar fecha de entrega
  if (status === ShipmentStatus.DELIVERED) {
    updateData.deliveryDate = Date.now();
  }

  await shipmentRef.update(updateData);

  return {
    success: true,
    shipmentId,
    newStatus: status,
    message: `Estado actualizado a ${status}`,
  };
}
