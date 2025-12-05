import * as admin from "firebase-admin";

export async function getUserRatings(userId: string): Promise<any[]> {
  const db = admin.database();

  const ratingsRef = db.ref("ratings");
  const snapshot = await ratingsRef
    .orderByChild("toUserId")
    .equalTo(userId)
    .once("value");

  const ratingsData = snapshot.val() || {};

  // Convertir a array y ordenar por fecha
  const ratings = Object.entries(ratingsData).map(([id, data]: [string, any]) => ({
    id,
    ...data,
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
  }));

  // Ordenar por fecha descendente
  ratings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return ratings;
}
