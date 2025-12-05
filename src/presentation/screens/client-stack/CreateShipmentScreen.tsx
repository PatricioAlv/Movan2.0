import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { AddressAutocomplete } from '@presentation/components/common/AddressAutocomplete';
import { LocationPicker } from '@presentation/components/common/LocationPicker';
import { CargoType } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import { GOOGLE_MAPS_CONFIG } from '@infrastructure/utils/googleMaps.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const API_BASE_URL = `${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

interface CreateShipmentScreenProps {
  navigation: any;
}

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

const CARGO_TYPES = [
  { label: 'General', value: CargoType.GENERAL },
  { label: 'Frágil', value: CargoType.FRAGILE },
  { label: 'Perecedero', value: CargoType.PERISHABLE },
  { label: 'Peligroso', value: CargoType.HAZARDOUS },
  { label: 'Pesado', value: CargoType.HEAVY },
];

export const CreateShipmentScreen: React.FC<CreateShipmentScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showOriginMap, setShowOriginMap] = useState(false);
  const [showDestinationMap, setShowDestinationMap] = useState(false);

  const [originLocation, setOriginLocation] = useState<LocationData | null>(null);
  const [originContactName, setOriginContactName] = useState('');
  const [originContactPhone, setOriginContactPhone] = useState('');

  const [destinationLocation, setDestinationLocation] = useState<LocationData | null>(null);
  const [destinationContactName, setDestinationContactName] = useState('');
  const [destinationContactPhone, setDestinationContactPhone] = useState('');

  const [cargoType, setCargoType] = useState<CargoType>(CargoType.GENERAL);
  const [cargoDescription, setCargoDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const validateForm = (): boolean => {
    if (!originLocation) {
      Alert.alert('Error', 'La dirección de origen es requerida');
      return false;
    }
    if (!destinationLocation) {
      Alert.alert('Error', 'La dirección de destino es requerida');
      return false;
    }
    if (!cargoDescription.trim()) {
      Alert.alert('Error', 'La descripción de la carga es requerida');
      return false;
    }
    if (!weight.trim() || parseFloat(weight) <= 0) {
      Alert.alert('Error', 'El peso debe ser mayor a 0');
      return false;
    }
    if (!price.trim() || parseFloat(price) < 0) {
      Alert.alert('Error', 'El precio no puede ser negativo');
      return false;
    }
    return true;
  };

  const handleCreateShipment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'No se pudo obtener el usuario actual');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: userId,
          origin: {
            address: originLocation!.address,
            latitude: originLocation!.latitude,
            longitude: originLocation!.longitude,
            contactName: originContactName.trim() || undefined,
            contactPhone: originContactPhone.trim() || undefined,
          },
          destination: {
            address: destinationLocation!.address,
            latitude: destinationLocation!.latitude,
            longitude: destinationLocation!.longitude,
            contactName: destinationContactName.trim() || undefined,
            contactPhone: destinationContactPhone.trim() || undefined,
          },
          cargoType,
          cargoDescription: cargoDescription.trim(),
          weight: parseFloat(weight),
          price: parseFloat(price),
          pickupDate: new Date().toISOString(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo crear el envío');
      }

      Alert.alert(
        'Éxito',
        'Envío creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      Alert.alert('Error', error.message || 'No se pudo crear el envío');
    } finally {
      setLoading(false);
    }
  };

  const handleUseExampleData = () => {
    // Datos de ejemplo para pruebas rápidas
    setOriginLocation({
      address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
      latitude: -34.6037,
      longitude: -58.3816,
    });
    setOriginContactName('Juan Pérez');
    setOriginContactPhone('+5491123456789');

    setDestinationLocation({
      address: 'San Martín 567, Mendoza, Argentina',
      latitude: -32.8895,
      longitude: -68.8458,
    });
    setDestinationContactName('María González');
    setDestinationContactPhone('+5491198765432');

    setCargoType(CargoType.GENERAL);
    setCargoDescription('Electrodomésticos varios');
    setWeight('500');
    setPrice('25000');
    setNotes('Manejar con cuidado, entregar en horario comercial');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Nuevo Envío</Text>
          <TouchableOpacity onPress={handleUseExampleData} style={styles.exampleButton}>
            <FontAwesome name="magic" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* ORIGEN */}
        <View style={[styles.section, { zIndex: 2000 }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="map-marker" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Origen</Text>
          </View>
          
          {GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' ? (
            <>
              <View style={[styles.autocompleteContainer, { zIndex: 2000 }]}>
                <AddressAutocomplete 
                  onSelectAddress={setOriginLocation}
                  placeholder="Buscar dirección de origen"
                  apiKey={GOOGLE_MAPS_CONFIG.apiKey}
                  value={originLocation?.address || ''}
                  inputStyle={styles.input}
                />
              </View>
              
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => setShowOriginMap(true)}
              >
                <FontAwesome name="map" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.mapButtonText}>
                  {originLocation ? 'Cambiar ubicación en el mapa' : 'Seleccionar en el mapa'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Configura tu Google Maps API Key en:
              </Text>
              <Text style={styles.warningPath}>
                src/infrastructure/utils/googleMaps.config.ts
              </Text>
            </View>
          )}

          {originLocation && (
            <View style={styles.selectedLocation}>
              <FontAwesome name="check-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={styles.selectedLocationText}>
                {originLocation.address}
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre de contacto</Text>
            <RNTextInput
              style={styles.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={originContactName}
              onChangeText={setOriginContactName}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono de contacto</Text>
            <RNTextInput
              style={styles.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={originContactPhone}
              onChangeText={setOriginContactPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* DESTINO */}
        <View style={[styles.section, { zIndex: 1000 }]}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="flag" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Destino</Text>
          </View>
          
          {GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' ? (
            <>
              <View style={[styles.autocompleteContainer, { zIndex: 1000 }]}>
                <AddressAutocomplete
                  onSelectAddress={setDestinationLocation}
                  placeholder="Buscar dirección de destino"
                  apiKey={GOOGLE_MAPS_CONFIG.apiKey}
                  value={destinationLocation?.address || ''}
                  inputStyle={styles.input}
                />
              </View>
              
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => setShowDestinationMap(true)}
              >
                <FontAwesome name="map" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.mapButtonText}>
                  {destinationLocation ? 'Cambiar ubicación en el mapa' : 'Seleccionar en el mapa'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Configura tu Google Maps API Key
              </Text>
            </View>
          )}

          {destinationLocation && (
            <View style={styles.selectedLocation}>
              <FontAwesome name="check-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={styles.selectedLocationText}>
                {destinationLocation.address}
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre de contacto</Text>
            <RNTextInput
              style={styles.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={destinationContactName}
              onChangeText={setDestinationContactName}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Teléfono de contacto</Text>
            <RNTextInput
              style={styles.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={destinationContactPhone}
              onChangeText={setDestinationContactPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* TIPO DE CARGA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="cube" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Tipo de Carga</Text>
          </View>
          <View style={styles.cargoTypeContainer}>
            {CARGO_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.cargoTypeButton,
                  cargoType === type.value && styles.cargoTypeButtonActive,
                ]}
                onPress={() => setCargoType(type.value)}
              >
                <Text
                  style={[
                    styles.cargoTypeText,
                    cargoType === type.value && styles.cargoTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* DETALLES DE CARGA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="list-alt" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Detalles de la Carga</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Descripción</Text>
            <RNTextInput
              style={styles.input}
              placeholder="Ej: Muebles de oficina"
              placeholderTextColor="#64748B"
              value={cargoDescription}
              onChangeText={setCargoDescription}
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <RNTextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.halfInput}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Precio ($)</Text>
                <RNTextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#64748B"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notas adicionales</Text>
            <RNTextInput
              style={[styles.input, styles.textArea]}
              placeholder="Instrucciones especiales..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleCreateShipment}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.createButtonText}>Creando...</Text>
            ) : (
              <>
                <FontAwesome name="check" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.createButtonText}>Crear Envío</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de selección de ubicación de origen */}
      <LocationPicker
        visible={showOriginMap}
        onClose={() => setShowOriginMap(false)}
        onSelectLocation={(location) => {
          setOriginLocation(location);
          setShowOriginMap(false);
        }}
        initialLocation={originLocation || undefined}
        title="Seleccionar origen"
      />

      {/* Modal de selección de ubicación de destino */}
      <LocationPicker
        visible={showDestinationMap}
        onClose={() => setShowDestinationMap(false)}
        onSelectLocation={(location) => {
          setDestinationLocation(location);
          setShowDestinationMap(false);
        }}
        initialLocation={destinationLocation || undefined}
        title="Seleccionar destino"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F172A',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exampleButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  autocompleteContainer: {
    marginBottom: 12,
    backgroundColor: '#334155',
    borderRadius: 8,
    zIndex: 10,
    // AddressAutocomplete might need internal styling adjustments if possible, 
    // but container helps background.
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  warningBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  warningText: {
    color: '#F59E0B',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningPath: {
    color: '#F59E0B',
    fontSize: 12,
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  selectedLocationText: {
    color: '#10B981',
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  cargoTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cargoTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
  },
  cargoTypeButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  cargoTypeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  cargoTypeTextActive: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  textArea: {
    height: 100,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});