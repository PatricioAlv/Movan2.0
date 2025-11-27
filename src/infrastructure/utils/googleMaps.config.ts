import { GOOGLE_MAPS_API_KEY } from '@env';

export const GOOGLE_MAPS_CONFIG = {
  apiKey: GOOGLE_MAPS_API_KEY,
  defaultRegion: {
    latitude: -34.6037, // Buenos Aires, Argentina
    longitude: -58.3816,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};
