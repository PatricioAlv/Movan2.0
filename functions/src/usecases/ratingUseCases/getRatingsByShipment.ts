import * as admin from "firebase-admin";

export async function getRatingsByShipment(shipmentId: string): Promise<any[]> {
  const db = admin.database();

  const ratingsRef = db.ref("ratings");
  const snapshot = await ratingsRef
    .orderByChild("shipmentId")
    .equalTo(shipmentId)
    .once("value");

  const ratingsData = snapshot.val() || {};

  // Convertir a array
  const ratings = Object.entries(ratingsData).map(([id, data]: [string, any]) => ({
    id,
    ...data,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
  }));

  // Ordenar por fecha descendente
  ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return ratings;
}
