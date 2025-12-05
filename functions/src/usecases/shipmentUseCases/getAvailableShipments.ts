import * as admin from 'firebase-admin';

export async function getAvailableShipments() {
  const shipmentsRef = admin.database().ref('shipments');
  const snapshot = await shipmentsRef.orderByChild('status').equalTo('PENDING').get();

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

  // Ordenar por fecha de creación (más recientes primero)
  shipments.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return shipments;
}
