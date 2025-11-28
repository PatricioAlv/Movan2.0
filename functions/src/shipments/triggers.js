import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onShipmentCreated = functions.database
  .ref('/shipments/{shipmentId}')
  .onCreate(async (snapshot, context) => {
    const shipment = snapshot.val();
    const shipmentId = context.params.shipmentId;

    functions.logger.info(`Nuevo envío creado: ${shipmentId}`);

    try {
      // Obtener todos los conductores
      const driversSnapshot = await admin
        .database()
        .ref('users')
        .orderByChild('role')
        .equalTo('driver')
        .once('value');

      if (!driversSnapshot.exists()) {
        functions.logger.info('No hay conductores registrados');
        return;
      }

      const drivers = driversSnapshot.val();
      const tokens = [];

      // Recopilar tokens FCM
      Object.values(drivers).forEach((driver) => {
        if (driver.fcmToken) {
          tokens.push(driver.fcmToken);
        }
      });

      if (tokens.length === 0) {
        functions.logger.info('No hay tokens FCM disponibles');
        return;
      }

      // Enviar notificación
      const message = {
        notification: {
          title: '🚚 Nuevo envío disponible',
          body: `${shipment.cargoType} - $${shipment.price}`,
        },
        data: {
          type: 'new_shipment',
          shipmentId,
          cargoType: shipment.cargoType,
          price: shipment.price.toString(),
        },
        tokens,
      };

      const response = await admin.messaging().sendMulticast(message);

      functions.logger.info(
        `Notificaciones enviadas: ${response.successCount}/${tokens.length}`
      );
    } catch (error) {
      functions.logger.error('Error al enviar notificaciones:', error);
    }
  });
