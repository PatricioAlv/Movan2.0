import {createRating} from "../usecases/ratingUseCases/createRating";
import {getUserRatings} from "../usecases/ratingUseCases/getUserRatings";
import {checkUserRated} from "../usecases/ratingUseCases/checkUserRated";
import {getUserAverageRating} from "../usecases/ratingUseCases/getUserAverageRating";
import {getRatingsByShipment} from "../usecases/ratingUseCases/getRatingsByShipment";
import {deleteRating} from "../usecases/ratingUseCases/deleteRating";
import {Request, Response} from "express";

export async function createRatingController(req: Request, res: Response) {
  try {
    const {fromUserId, shipmentId, toUserId, rating, comment} = req.body;

    if (!fromUserId || !shipmentId || !toUserId || rating === undefined) {
      return res.status(400).json({
        error: "Faltan campos requeridos: fromUserId, shipmentId, toUserId, rating",
        code: "missing-fields",
      });
    }

    const result = await createRating(fromUserId, {
      shipmentId,
      toUserId,
      rating,
      comment,
    });

    return res.status(201).json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 :
      error.code === "already-rated" ? 409 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}

export async function getUserRatingsController(req: Request, res: Response) {
  try {
    const {userId} = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Se requiere userId",
        code: "missing-userId",
      });
    }

    const result = await getUserRatings(userId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function checkUserRatedController(req: Request, res: Response) {
  try {
    const {shipmentId, userId} = req.params;

    if (!shipmentId || !userId) {
      return res.status(400).json({
        error: "Se requieren shipmentId y userId",
        code: "missing-params",
      });
    }

    const hasRated = await checkUserRated(userId, shipmentId);
    return res.json({hasRated});
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function getUserAverageRatingController(req: Request, res: Response) {
  try {
    const {userId} = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Se requiere userId",
        code: "missing-userId",
      });
    }

    const result = await getUserAverageRating(userId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function getRatingsByShipmentController(req: Request, res: Response) {
  try {
    const {shipmentId} = req.params;

    if (!shipmentId) {
      return res.status(400).json({
        error: "Se requiere shipmentId",
        code: "missing-shipmentId",
      });
    }

    const result = await getRatingsByShipment(shipmentId);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({error: error.message, code: error.code});
  }
}

export async function deleteRatingController(req: Request, res: Response) {
  try {
    const {ratingId} = req.params;

    if (!ratingId) {
      return res.status(400).json({
        error: "Se requiere ratingId",
        code: "missing-ratingId",
      });
    }

    const result = await deleteRating(ratingId);
    return res.json(result);
  } catch (error: any) {
    const statusCode = error.code === "not-found" ? 404 : 400;
    return res.status(statusCode).json({error: error.message, code: error.code});
  }
}
