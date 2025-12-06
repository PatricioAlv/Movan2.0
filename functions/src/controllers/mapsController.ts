import {Request, Response} from "express";
import {searchPlaces} from "../usecases/mapsUseCases/searchPlaces";
import {getPlaceDetails} from "../usecases/mapsUseCases/getPlaceDetails";

/**
 * POST /maps/search
 * Body: { query: string, country?: string }
 * Response: { predictions: Prediction[] }
 */
export async function searchPlacesController(req: Request, res: Response) {
  try {
    const {query, country} = req.body as { query: string; country?: string };

    if (!query) {
      return res.status(400).json({
        error: "El campo 'query' es requerido",
        code: "missing-query",
      });
    }

    const predictions = await searchPlaces(query, country);
    return res.json({predictions});
  } catch (error: any) {
    console.error("Error in searchPlacesController:", error);
    return res.status(400).json({
      error: error.message || "Error al buscar lugares",
      code: error.code || "search-error",
    });
  }
}

/**
 * POST /maps/details
 * Body: { placeId: string }
 * Response: { address: string, latitude: number, longitude: number }
 */
export async function getPlaceDetailsController(req: Request, res: Response) {
  try {
    const {placeId} = req.body as { placeId: string };

    if (!placeId) {
      return res.status(400).json({
        error: "El campo 'placeId' es requerido",
        code: "missing-place-id",
      });
    }

    const details = await getPlaceDetails(placeId);
    return res.json(details);
  } catch (error: any) {
    console.error("Error in getPlaceDetailsController:", error);
    const statusCode = error.code === "place-not-found" ? 404 : 400;
    return res.status(statusCode).json({
      error: error.message || "Error al obtener detalles del lugar",
      code: error.code || "details-error",
    });
  }
}
