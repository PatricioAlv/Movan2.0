import { Request, Response } from 'express';
import { getDriverShipments } from '../usecases/transHome/getDriverShipments';
import { getShipmentDetails } from '../usecases/transHome/getShipmentDetails';
import { acceptShipment } from '../usecases/transHome/acceptShipment';
import * as admin from 'firebase-admin';

export async function getDriverShipmentsController(req: Request, res: Response) {
  try {
    // Soportar tanto body (POST) como params (GET)
    const driverId = req.body?.driverId || req.params?.driverId;

    const shipments = await getDriverShipments(driverId);

    return res.json({
      success: true,
      shipments,
      count: shipments.length
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }
}

export async function getShipmentDetailsController(req: Request, res: Response) {
  try {
    const { shipmentId } = req.body as { shipmentId: string };

    const shipment = await getShipmentDetails(shipmentId);

    return res.json({
      success: true,
      shipment
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }
}

export async function acceptShipmentController(req: Request, res: Response) {
  try {
    const { shipmentId, driverId } = req.body as { shipmentId: string; driverId: string };

    const result = await acceptShipment(shipmentId, driverId);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }
}

export async function getAvailableShipmentsController(req: Request, res: Response) {
  try {
    const shipmentsRef = admin.database().ref('shipments');
    const snapshot = await shipmentsRef
      .orderByChild('status')
      .equalTo('PENDING')
      .get();

    if (!snapshot.exists()) {
      return res.json({ success: true, shipments: [], count: 0 });
    }

    const shipments: any[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      // Solo incluir envíos sin conductor asignado
      if (!data.driverId) {
        shipments.push({ id: child.key, ...data });
      }
    });

    return res.json({
      success: true,
      shipments,
      count: shipments.length
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }
}

export async function getShipmentByIdController(req: Request, res: Response) {
  try {
    const { shipmentId } = req.params;

    if (!shipmentId) {
      throw { code: 'missing-shipment-id', message: 'El ID del envío es requerido' };
    }

    const shipment = await getShipmentDetails(shipmentId);

    return res.json({
      success: true,
      shipment
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }
}

export async function startPickupController(req: Request, res: Response) {
  try {
    const { shipmentId, driverId } = req.body as { shipmentId: string; driverId: string };

    if (!shipmentId || !driverId) {
      throw { code: 'missing-fields', message: 'shipmentId y driverId son requeridos' };
    }

    const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
    const snapshot = await shipmentRef.get();

    if (!snapshot.exists()) {
      throw { code: 'not-found', message: 'Envío no encontrado' };
    }

    const shipmentData = snapshot.val();

    if (shipmentData.driverId !== driverId) {
      throw { code: 'unauthorized', message: 'No tienes permiso para este envío' };
    }

    if (shipmentData.status !== 'ACCEPTED') {
      throw { code: 'invalid-status', message: 'El envío debe estar en estado ACCEPTED' };
    }

    await shipmentRef.update({
      status: 'IN_TRANSIT',
      pickupStartedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return res.json({
      success: true,
      shipmentId,
      newStatus: 'IN_TRANSIT'
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }
}

export async function confirmDeliveryController(req: Request, res: Response) {
  try {
    const { shipmentId, driverId } = req.body as { shipmentId: string; driverId: string };

    if (!shipmentId || !driverId) {
      throw { code: 'missing-fields', message: 'shipmentId y driverId son requeridos' };
    }

    const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
    const snapshot = await shipmentRef.get();

    if (!snapshot.exists()) {
      throw { code: 'not-found', message: 'Envío no encontrado' };
    }

    const shipmentData = snapshot.val();

    if (shipmentData.driverId !== driverId) {
      throw { code: 'unauthorized', message: 'No tienes permiso para este envío' };
    }

    if (shipmentData.status !== 'IN_TRANSIT') {
      throw { code: 'invalid-status', message: 'El envío debe estar en tránsito' };
    }

    await shipmentRef.update({
      status: 'DELIVERED',
      deliveredAt: Date.now(),
      updatedAt: Date.now(),
    });

    return res.json({
      success: true,
      shipmentId,
      newStatus: 'DELIVERED'
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
      code: error.code
    });
  }
}