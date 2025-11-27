import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button } from './Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';
import { GOOGLE_MAPS_CONFIG } from '@infrastructure/utils/googleMaps.config';

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  initialLocation?: Location;
  title?: string;
}

const { width, height } = Dimensions.get('window');

export const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
  onSelectLocation,
  initialLocation,
  title = 'Selecciona una ubicación',
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    initialLocation
      ? { latitude: initialLocation.latitude, longitude: initialLocation.longitude }
      : null
  );

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Por favor selecciona una ubicación en el mapa');
      return;
    }

    // Obtener la dirección usando Geocoding
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.latitude},${selectedLocation.longitude}&key=${GOOGLE_MAPS_CONFIG.apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        onSelectLocation({
          address,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });
        onClose();
      } else {
        Alert.alert('Error', 'No se pudo obtener la dirección');
      }
    } catch (error) {
      console.error('Error getting address:', error);
      Alert.alert('Error', 'No se pudo obtener la dirección');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: initialLocation?.latitude || -34.6037,
            longitude: initialLocation?.longitude || -58.3816,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Ubicación seleccionada"
            />
          )}
        </MapView>

        <View style={styles.footer}>
          <Text style={styles.instruction}>
            Toca en el mapa para seleccionar una ubicación
          </Text>
          <Button
            title="Confirmar ubicación"
            onPress={handleConfirm}
            disabled={!selectedLocation}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: typography.fontSize['2xl'],
    color: colors.textSecondary,
    padding: spacing.sm,
  },
  map: {
    flex: 1,
    width: width,
    height: height - 200,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  instruction: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
