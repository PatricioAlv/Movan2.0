import { Request, Response } from 'express';
import { getDriverShipments } from '../usecases/transHome/getDriverShipments';
import { getShipmentDetails } from '../usecases/transHome/getShipmentDetails';
import { acceptShipment } from '../usecases/transHome/acceptShipment';

export async function getDriverShipmentsController(req: Request, res: Response) {
  try {
    const { driverId } = req.body as { driverId: string };
    
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
