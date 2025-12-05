import { cancelShipment } from '../usecases/shipmentUseCases/cancelShipment';
import { Request, Response } from 'express';

export async function cancelShipmentController(req: Request, res: Response) {
  try {
    const { shipmentId } = req.body as { shipmentId: string };
    const result = await cancelShipment(shipmentId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message, code: error.code });
  }
}