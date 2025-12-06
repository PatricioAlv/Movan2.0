// API Key de Google Maps - en producción usar Secret Manager
const GOOGLE_MAPS_API_KEY = "AIzaSyCW39d9V4_n71WXVtj_GUNStURgFf3d008";

interface PlaceDetails {
  address: string;
  latitude: number;
  longitude: number;
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  if (!placeId) {
    throw {code: "missing-place-id", message: "El place_id es requerido"};
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw {code: "missing-api-key", message: "Google Maps API key no configurada"};
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}&fields=geometry,formatted_address`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.result && data.result.geometry) {
      const {lat, lng} = data.result.geometry.location;

      return {
        address: data.result.formatted_address || "",
        latitude: lat,
        longitude: lng,
      };
    }

    if (data.status === "NOT_FOUND" || data.status === "INVALID_REQUEST") {
      throw {code: "place-not-found", message: "Lugar no encontrado"};
    }

    if (data.status === "REQUEST_DENIED") {
      console.error("Google Maps API error:", data.error_message);
      throw {code: "api-error", message: "Error en la API de Google Maps"};
    }

    throw {code: "unknown-error", message: "No se pudo obtener los detalles del lugar"};
  } catch (error: any) {
    console.error("Error getting place details:", error);
    throw {code: error.code || "details-error", message: error.message || "Error al obtener detalles del lugar"};
  }
}
