import { Request, Response } from 'express';
import { getDriverShipments } from '../usecases/transHome/getDriverShipments';

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
