import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequired } from '../utils/validation.js';

export const acceptShipment = functions.https.onCall(
  async (data, context) => {
    const driverId = requireAuth(context);
    requireRole(context, 'driver');

    const { shipmentId } = data;
    validateRequired({ shipmentId });

    try {
      const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
      const snapshot = await shipmentRef.once('value');

      if (!snapshot.exists()) {
        throw new functions.https.HttpsError('not-found', 'Envío no encontrado');
      }

      const shipment = snapshot.val();

      if (shipment.status !== 'pending') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Este envío ya no está disponible'
        );
      }

      // Actualizar envío
      await shipmentRef.update({
        driverId,
        status: 'accepted',
        acceptedAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP
      });

      functions.logger.info(`Envío aceptado: ${shipmentId}`, { driverId });

      return {
        success: true,
        message: 'Envío aceptado exitosamente'
      };
    } catch (error) {
      functions.logger.error('Error al aceptar envío:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
