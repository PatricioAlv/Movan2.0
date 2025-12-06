import React, { useState, useEffect } from 'react';
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

const API_BASE_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

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
  value?: string;
  inputStyle?: object;
  containerStyle?: object;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelectAddress,
  placeholder = 'Buscar dirección',
  value: initialValue = '',
  inputStyle,
  containerStyle,
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [typingTimeout, setTypingTimeout] =
    useState<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Limpia el timeout cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  const handleChangeText = (text: string) => {
    setSearchText(text);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Si borra todo, limpiamos las predicciones
    if (text.length === 0) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    const timeout = setTimeout(() => {
      searchPlaces(text);
    }, 1000); 

    setTypingTimeout(timeout);
  };

  const searchPlaces = async (text: string) => {
    if (text.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/maps/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, country: 'ar' }),
      });
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
      const response = await fetch(`${API_BASE_URL}/maps/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });
      const data = await response.json();

      if (data.latitude && data.longitude) {
        onSelectAddress({
          address: data.address || description,
          latitude: data.latitude,
          longitude: data.longitude,
        });

        setSearchText(data.address || description);
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
    backgroundColor: '#1E293B',
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
