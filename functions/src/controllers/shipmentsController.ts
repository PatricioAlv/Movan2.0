import {cancelShipment} from "../usecases/shipmentUseCases/cancelShipment";
import {startPickup} from "../usecases/shipmentUseCases/startPickup";
import {confirmDelivery} from "../usecases/shipmentUseCases/confirmDelivery";
import {getShipmentById} from "../usecases/shipmentUseCases/getShipmentById";
import {getDriverShipments} from "../usecases/shipmentUseCases/getDriverShipments";
import {getAvailableShipments} from "../usecases/shipmentUseCases/getAvailableShipments";
import {getClientShipments} from "../usecases/shipmentUseCases/getClientShipments";
import {createShipment} from "../usecases/shipmentUseCases/createShipment";
import {updateShipmentStatus} from "../usecases/shipmentUseCases/updateShipmentStatus";
import {acceptShipment} from "../usecases/shipmentUseCases/acceptShipment";
import {Request, Response} from "express";

export async function cancelShipmentController(req: Request, res: Response) {
  try {
    const {shipmentId} = req.body as { shipmentId: string };
    const result = await cancelShipment(shipmentId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function getShipmentByIdController(req: Request, res: Response) {
  try {
    const {shipmentId} = req.params as { shipmentId: string };
    const result = await getShipmentById(shipmentId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function startPickupController(req: Request, res: Response) {
  try {
    const {shipmentId, driverId} = req.body as { shipmentId: string; driverId?: string };
    const result = await startPickup(shipmentId, driverId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 :
      error.code === "permission-denied" ? 403 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function confirmDeliveryController(req: Request, res: Response) {
  try {
    const {shipmentId, driverId} = req.body as { shipmentId: string; driverId?: string };
    const result = await confirmDelivery(shipmentId, driverId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 :
      error.code === "permission-denied" ? 403 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function getDriverShipmentsController(req: Request, res: Response) {
  try {
    const {driverId} = req.params as { driverId: string };
    const result = await getDriverShipments(driverId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function getAvailableShipmentsController(req: Request, res: Response) {
  try {
    const result = await getAvailableShipments();
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function getClientShipmentsController(req: Request, res: Response) {
  try {
    const {clientId} = req.params as { clientId: string };
    const result = await getClientShipments(clientId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function createShipmentController(req: Request, res: Response) {
  try {
    const result = await createShipment(req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function updateShipmentStatusController(req: Request, res: Response) {
  try {
    const {shipmentId, status, driverId} = req.body as {
      shipmentId: string;
      status: string;
      driverId?: string
    };
    const result = await updateShipmentStatus(shipmentId, status, driverId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 :
      error.code === "permission-denied" ? 403 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function acceptShipmentController(req: Request, res: Response) {
  try {
    const {shipmentId, driverId} = req.body as {
      shipmentId: string;
      driverId: string;
    };

    if (!shipmentId || !driverId) {
      return res.status(400).json({
        error: "Se requieren shipmentId y driverId",
        code: "missing-fields",
      });
    }

    const result = await acceptShipment(shipmentId, driverId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 :
      error.code === "invalid-status" || error.code === "already-assigned" ? 409 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}
