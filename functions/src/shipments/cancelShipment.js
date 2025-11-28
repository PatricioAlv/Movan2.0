import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth } from '../middleware/auth.js';
import { validateRequired } from '../utils/validation.js';

export const cancelShipment = functions.https.onCall(
  async (data, context) => {
    const userId = requireAuth(context);
    const { shipmentId, reason } = data;

    validateRequired({ shipmentId });

    try {
      const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
      const snapshot = await shipmentRef.once('value');

      if (!snapshot.exists()) {
        throw new functions.https.HttpsError('not-found', 'Envío no encontrado');
      }

      const shipment = snapshot.val();
      const userRole = context.auth?.token.role;

      // Permisos según rol
      if (userRole === 'client' && shipment.clientId !== userId) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'No tienes permiso para cancelar este envío'
        );
      }

      if (userRole === 'driver' && shipment.driverId !== userId) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'No tienes permiso para cancelar este envío'
        );
      }

      if (['completed', 'cancelled'].includes(shipment.status)) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Este envío no puede ser cancelado'
        );
      }

      // Cancelar envío
      await shipmentRef.update({
        status: 'cancelled',
        cancelledBy: userId,
        cancelReason: reason || '',
        cancelledAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP
      });

      functions.logger.info(`Envío cancelado: ${shipmentId}`, { userId, reason });

      return {
        success: true,
        message: 'Envío cancelado exitosamente'
      };
    } catch (error) {
      functions.logger.error('Error al cancelar envío:', error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
