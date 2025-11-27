import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Input } from './Input';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  onSelectAddress: (location: Location) => void;
  placeholder?: string;
  apiKey: string;
  value?: string;
  inputStyle?: object;
  containerStyle?: object;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelectAddress,
  placeholder = 'Buscar dirección',
  apiKey,
  value: initialValue = '',
  inputStyle,
  containerStyle,
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangeText = (text: string) => {
  setSearchText(text);

  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }

  const timeout = setTimeout(() => {
    searchPlaces(text);
  }, 1800);

  setTypingTimeout(timeout);
  };

  const searchPlaces = async (text: string) => {
    setSearchText(text);

    if (text.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text
        )}&key=${apiKey}&language=es&components=country:ar`
      );
      const data = await response.json();

      if (data.predictions) {
        setPredictions(data.predictions);
        setShowPredictions(true);
      }
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectPlace = async (placeId: string, description: string) => {
    setLoading(true);
    try {
      // Obtener detalles del lugar para conseguir las coordenadas
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=geometry,formatted_address`
      );
      const data = await response.json();

      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        onSelectAddress({
          address: data.result.formatted_address || description,
          latitude: lat,
          longitude: lng,
        });

        setSearchText(data.result.formatted_address || description);
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        style={[styles.textInputArea, inputStyle]}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleChangeText}
        onFocus={() => predictions.length > 0 && setShowPredictions(true)}
        editable={!loading}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {showPredictions && predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          {predictions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.predictionItem}
              onPress={() => selectPlace(item.place_id, item.description)}
            >
              <Text style={styles.predictionMainText}>
                {item.structured_formatting?.main_text || item.description}
              </Text>
              {item.structured_formatting?.secondary_text && (
                <Text style={styles.predictionSecondaryText}>
                  {item.structured_formatting.secondary_text}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    zIndex: 1,
    position: 'relative',
  },
  textInputArea: {
    color: '#242424ff',
  },
  loadingContainer: {
    position: 'absolute',
    right: spacing.md,
    top: 20,
  },
  predictionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1E293B', // Dark theme background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginTop: 4,
  },
  predictionItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  predictionMainText: {
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.medium,
  },
  predictionSecondaryText: {
    fontSize: typography.fontSize.xs,
    color: '#94A3B8',
    marginTop: spacing.xs / 2,
  },
});
