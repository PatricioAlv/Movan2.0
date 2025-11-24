// Configuración de Google Maps API
// IMPORTANTE: Reemplaza 'YOUR_GOOGLE_MAPS_API_KEY' con tu API key real
// Obtén tu API key en: https://console.cloud.google.com/

export const GOOGLE_MAPS_CONFIG = {
  apiKey: 'AIzaSyCW39d9V4_n71WXVtj_GUNStURgFf3d008', // Reemplaza con tu API key
  defaultRegion: {
    latitude: -34.6037, // Buenos Aires, Argentina
    longitude: -58.3816,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};

// INSTRUCCIONES para obtener la API key:
// 1. Ve a https://console.cloud.google.com/
// 2. Crea un proyecto o selecciona uno existente
// 3. Ve a "APIs & Services" > "Credentials"
// 4. Crea una API Key
// 5. Habilita estas APIs:
//    - Maps SDK for Android
//    - Maps SDK for iOS
//    - Places API
//    - Geocoding API
// 6. Copia la API key y pégala arriba

