import * as admin from "firebase-admin";

export async function deleteRating(ratingId: string): Promise<{ success: boolean; message: string }> {
  const db = admin.database();
  const ratingRef = db.ref(`ratings/${ratingId}`);

  const snapshot = await ratingRef.once("value");
  if (!snapshot.exists()) {
    const error = new Error("Calificación no encontrada");
    (error as any).code = "not-found";
    throw error;
  }

  const ratingData = snapshot.val();
  const toUserId = ratingData.toUserId;

  // Eliminar la calificación
  await ratingRef.remove();

  // Recalcular el promedio del usuario calificado
  if (toUserId) {
    await recalculateUserAverage(toUserId);
  }

  return {
    success: true,
    message: "Calificación eliminada correctamente",
  };
}

async function recalculateUserAverage(userId: string): Promise<void> {
  const db = admin.database();

  // Obtener todas las calificaciones restantes del usuario
  const ratingsRef = db.ref("ratings");
  const snapshot = await ratingsRef
    .orderByChild("toUserId")
    .equalTo(userId)
    .once("value");

  const ratings = snapshot.val() || {};
  const ratingValues = Object.values(ratings) as any[];

  const userRef = db.ref(`users/${userId}`);

  if (ratingValues.length > 0) {
    const total = ratingValues.reduce((sum: number, r: any) => sum + r.rating, 0);
    const average = total / ratingValues.length;

    await userRef.update({
      averageRating: Math.round(average * 10) / 10,
      totalRatings: ratingValues.length,
    });
  } else {
    // Si no hay calificaciones, resetear
    await userRef.update({
      averageRating: 0,
      totalRatings: 0,
    });
  }
}
