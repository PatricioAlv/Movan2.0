// API Key de Google Maps - en producción usar Secret Manager
const GOOGLE_MAPS_API_KEY = "AIzaSyCW39d9V4_n71WXVtj_GUNStURgFf3d008";

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

export async function searchPlaces(query: string, country: string = "ar"): Promise<Prediction[]> {
  if (!query || query.length < 3) {
    return [];
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw {code: "missing-api-key", message: "Google Maps API key no configurada"};
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${GOOGLE_MAPS_API_KEY}&language=es&components=country:${country}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.predictions) {
      return data.predictions.map((p: any) => ({
        description: p.description,
        place_id: p.place_id,
        structured_formatting: p.structured_formatting,
      }));
    }

    if (data.status === "ZERO_RESULTS") {
      return [];
    }

    if (data.status === "REQUEST_DENIED") {
      console.error("Google Maps API error:", data.error_message);
      throw {code: "api-error", message: "Error en la API de Google Maps"};
    }

    return [];
  } catch (error: any) {
    console.error("Error searching places:", error);
    throw {code: error.code || "search-error", message: error.message || "Error al buscar lugares"};
  }
}
