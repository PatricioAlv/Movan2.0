import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth } from '../middleware/auth.js';
import { validateRequired } from '../utils/validation.js';

export const createRating = functions.https.onCall(
  async (data, context) => {
    const userId = requireAuth(context);
    const { shipmentId, rating, comment } = data;

    validateRequired({ shipmentId, rating });

    if (rating < 1 || rating > 5) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'La calificación debe estar entre 1 y 5'
      );
    }

    try {
      // Verificar existencia del envío
      const shipmentSnapshot = await admin
        .database()
        .ref(`shipments/${shipmentId}`)
        .once('value');

      if (!shipmentSnapshot.exists()) {
        throw new functions.https.HttpsError('not-found', 'Envío no encontrado');
      }

      const shipment = shipmentSnapshot.val();

      if (shipment.status !== 'completed') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Solo puedes calificar envíos completados'
        );
      }

      // Verificar participación del usuario
      if (shipment.clientId !== userId && shipment.driverId !== userId) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'No participaste en este envío'
        );
      }

      // Determinar quién recibe la calificación
      const ratedUserId =
        shipment.clientId === userId ? shipment.driverId : shipment.clientId;

      // Verificar que no exista una calificación previa del mismo usuario
      const existingRating = await admin
        .database()
        .ref('ratings')
        .orderByChild('shipmentId')
        .equalTo(shipmentId)
        .once('value');

      if (existingRating.exists()) {
        const ratings = existingRating.val();
        const alreadyRated = Object.values(ratings).some(
          r => r.reviewerId === userId
        );

        if (alreadyRated) {
          throw new functions.https.HttpsError(
            'already-exists',
            'Ya calificaste este envío'
          );
        }
      }

      // Crear registro de calificación
      const ratingRef = admin.database().ref('ratings').push();
      const ratingData = {
        id: ratingRef.key,
        shipmentId,
        reviewerId: userId,
        reviewedUserId: ratedUserId,
        rating,
        comment: comment || '',
        createdAt: admin.database.ServerValue.TIMESTAMP
      };

      await ratingRef.set(ratingData);

      // Recalcular el promedio del usuario calificado
      await updateUserAverageRating(ratedUserId);

      functions.logger.info(`Calificación creada`, { shipmentId, rating });

      return {
        success: true,
        ratingId: ratingRef.key,
        message: 'Calificación registrada exitosamente'
      };
    } catch (error) {
      functions.logger.error('Error al crear calificación:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);

async function updateUserAverageRating(userId) {
  const ratingsSnapshot = await admin
    .database()
    .ref('ratings')
    .orderByChild('reviewedUserId')
    .equalTo(userId)
    .once('value');

  if (!ratingsSnapshot.exists()) return;

  const ratings = Object.values(ratingsSnapshot.val());
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  const average = sum / ratings.length;

  await admin.database().ref(`users/${userId}`).update({
    averageRating: Number(average.toFixed(2)),
    totalRatings: ratings.length
  });
}
