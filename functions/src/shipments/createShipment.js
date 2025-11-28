import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequired } from '../utils/validation.js';

export const createShipment = functions.https.onCall(
  async (data, context) => {
    
    // Verificar autenticación y rol
    const userId = requireAuth(context);
    requireRole(context, 'client');

    const { cargoType, weight, price, origin, destination, description } = data;

    // Validaciones
    validateRequired({ cargoType, weight, price, origin, destination });

    if (weight <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'El peso debe ser mayor a 0');
    }

    if (price <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'El precio debe ser mayor a 0');
    }

    if (!origin.address || !origin.latitude || !origin.longitude) {
      throw new functions.https.HttpsError('invalid-argument', 'Datos de origen incompletos');
    }

    if (!destination.address || !destination.latitude || !destination.longitude) {
      throw new functions.https.HttpsError('invalid-argument', 'Datos de destino incompletos');
    }

    try {
      const shipmentRef = admin.database().ref('shipments').push();
      const shipmentId = shipmentRef.key;

      const shipmentData = {
        id: shipmentId,
        clientId: userId,
        cargoType,
        weight,
        price,
        origin,
        destination,
        description: description || '',
        status: 'pending',
        createdAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP
      };

      await shipmentRef.set(shipmentData);

      functions.logger.info(`Envío creado: ${shipmentId}`, { userId, cargoType });

      return {
        success: true,
        shipmentId,
        message: 'Envío creado exitosamente'
      };
    } catch (error) {
      functions.logger.error('Error al crear envío:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
