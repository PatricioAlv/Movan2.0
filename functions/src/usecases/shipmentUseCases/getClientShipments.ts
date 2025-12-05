import * as admin from 'firebase-admin';

export async function getClientShipments(clientId: string) {
  if (!clientId) {
    throw { code: 'missing-client-id', message: 'El ID del cliente es requerido' };
  }

  const shipmentsRef = admin.database().ref('shipments');
  const snapshot = await shipmentsRef.orderByChild('clientId').equalTo(clientId).get();

  if (!snapshot.exists()) {
    return [];
  }

  const shipments: any[] = [];
  snapshot.forEach((childSnapshot) => {
    shipments.push({
      id: childSnapshot.key,
      ...childSnapshot.val(),
    });
  });

  // Ordenar por fecha de actualización (más recientes primero)
  shipments.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  return shipments;
}
