import * as admin from "firebase-admin";

export async function checkUserRated(userId: string, shipmentId: string): Promise<boolean> {
  const db = admin.database();

  const ratingsRef = db.ref("ratings");
  const snapshot = await ratingsRef
    .orderByChild("shipmentId")
    .equalTo(shipmentId)
    .once("value");

  const ratingsData = snapshot.val() || {};

  // Verificar si el usuario ya calificó este envío
  const hasRated = Object.values(ratingsData).some(
    (rating: any) => rating.fromUserId === userId
  );

  return hasRated;
}
