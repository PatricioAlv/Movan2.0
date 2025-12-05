import * as admin from "firebase-admin";

interface CreateRatingData {
  shipmentId: string;
  toUserId: string;
  rating: number;
  comment?: string;
}

export async function createRating(fromUserId: string, data: CreateRatingData): Promise<any> {
  const db = admin.database();

  // Verificar que el usuario que califica existe
  const fromUserRef = db.ref(`users/${fromUserId}`);
  const fromUserSnapshot = await fromUserRef.once("value");
  if (!fromUserSnapshot.exists()) {
    const error = new Error("Usuario que califica no encontrado");
    (error as any).code = "not-found";
    throw error;
  }
  const fromUser = fromUserSnapshot.val();

  // Verificar que el usuario a calificar existe
  const toUserRef = db.ref(`users/${data.toUserId}`);
  const toUserSnapshot = await toUserRef.once("value");
  if (!toUserSnapshot.exists()) {
    const error = new Error("Usuario a calificar no encontrado");
    (error as any).code = "not-found";
    throw error;
  }

  // Verificar que no haya calificado antes este envío
  const existingRatingRef = db.ref("ratings");
  const existingRatingSnapshot = await existingRatingRef
    .orderByChild("shipmentId")
    .equalTo(data.shipmentId)
    .once("value");

  const existingRatings = existingRatingSnapshot.val() || {};
  const alreadyRated = Object.values(existingRatings).some(
    (r: any) => r.fromUserId === fromUserId
  );

  if (alreadyRated) {
    const error = new Error("Ya has calificado este envío");
    (error as any).code = "already-rated";
    throw error;
  }

  // Crear la calificación
  const ratingsRef = db.ref("ratings");
  const newRatingRef = ratingsRef.push();

  const ratingData = {
    id: newRatingRef.key,
    fromUserId,
    fromUserName: fromUser.name || "Usuario",
    toUserId: data.toUserId,
    shipmentId: data.shipmentId,
    rating: data.rating,
    comment: data.comment || null,
    createdAt: admin.database.ServerValue.TIMESTAMP,
  };

  await newRatingRef.set(ratingData);

  // Actualizar el promedio de calificaciones del usuario calificado
  await updateUserAverageRating(data.toUserId);

  return {
    ...ratingData,
    createdAt: Date.now(),
  };
}

async function updateUserAverageRating(userId: string): Promise<void> {
  const db = admin.database();

  // Obtener todas las calificaciones del usuario
  const ratingsRef = db.ref("ratings");
  const snapshot = await ratingsRef
    .orderByChild("toUserId")
    .equalTo(userId)
    .once("value");

  const ratings = snapshot.val() || {};
  const ratingValues = Object.values(ratings) as any[];

  if (ratingValues.length > 0) {
    const total = ratingValues.reduce((sum: number, r: any) => sum + r.rating, 0);
    const average = total / ratingValues.length;

    // Actualizar el usuario
    const userRef = db.ref(`users/${userId}`);
    await userRef.update({
      averageRating: Math.round(average * 10) / 10, // Redondear a 1 decimal
      totalRatings: ratingValues.length,
    });
  }
}
