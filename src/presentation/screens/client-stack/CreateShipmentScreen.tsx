import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity, TextInput as RNTextInput, } from 'react-native';
import { Input } from '@presentation/components/common/Input';
import { Button } from '@presentation/components/common/Button';
import { AddressAutocomplete } from '@presentation/components/common/AddressAutocomplete';
import { LocationPicker } from '@presentation/components/common/LocationPicker';
import { colors } from '@presentation/theme/colors';
import { container } from '@infrastructure/di/init';
import { TYPES } from '@infrastructure/di/types';
import { CreateShipmentUseCase } from '@core/usecases/shipments/CreateShipmentUseCase';
import { CargoType } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import { GOOGLE_MAPS_CONFIG } from '@infrastructure/utils/googleMaps.config';
import CreateShipmentScreenStyle from '@presentation/theme/Client-Screen-Styles/CreateShipmentScreen';

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

  // Datos de origen
  const [originLocation, setOriginLocation] = useState<LocationData | null>(null);
  const [originContactName, setOriginContactName] = useState('');
  const [originContactPhone, setOriginContactPhone] = useState('');

  // Datos de destino
  const [destinationLocation, setDestinationLocation] = useState<LocationData | null>(null);
  const [destinationContactName, setDestinationContactName] = useState('');
  const [destinationContactPhone, setDestinationContactPhone] = useState('');

  // Datos de carga
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

      const createShipmentUseCase = container.get<CreateShipmentUseCase>(
        TYPES.CreateShipmentUseCase
      );

      const newShipment = await createShipmentUseCase.execute(userId, {
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
        pickupDate: new Date(),
        notes: notes.trim() || undefined,
      });

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
    <SafeAreaView style={CreateShipmentScreenStyle.container}>
      <ScrollView
        contentContainerStyle={CreateShipmentScreenStyle.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={CreateShipmentScreenStyle.header}>
          <Text style={CreateShipmentScreenStyle.title}>Nuevo Envío</Text>
          <TouchableOpacity onPress={handleUseExampleData} style={CreateShipmentScreenStyle.exampleButton}>
            <Text style={CreateShipmentScreenStyle.exampleButtonText}> Usar datos de ejemplo</Text>
          </TouchableOpacity>
        </View>

        {/* ORIGEN */}
        <View style={CreateShipmentScreenStyle.section}>
          <Text style={CreateShipmentScreenStyle.sectionTitle}> Origen</Text>
          
          {GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' ? (
            <>
              <AddressAutocomplete 
                onSelectAddress={setOriginLocation}
                placeholder="Buscar dirección de origen"
                apiKey={GOOGLE_MAPS_CONFIG.apiKey}
                value={originLocation?.address || ''}
              />
              
              <TouchableOpacity
                style={CreateShipmentScreenStyle.mapButton}
                onPress={() => setShowOriginMap(true)}
              >
                <Text style={CreateShipmentScreenStyle.mapButtonText}>
                  {originLocation ? 'Cambiar ubicación en el mapa' : 'Seleccionar en el mapa'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={CreateShipmentScreenStyle.warningBox}>
              <Text style={CreateShipmentScreenStyle.warningText}>
                ⚠️ Configura tu Google Maps API Key en:
              </Text>
              <Text style={CreateShipmentScreenStyle.warningPath}>
                src/infrastructure/utils/googleMaps.config.ts
              </Text>
            </View>
          )}

          {originLocation && (
            <View style={CreateShipmentScreenStyle.selectedLocation}>
              <Text style={CreateShipmentScreenStyle.selectedLocationText}>
                ✓ {originLocation.address}
              </Text>
            </View>
          )}

          <Input style={CreateShipmentScreenStyle.details}
            placeholder="Nombre de contacto (opcional)"
            value={originContactName}
            onChangeText={setOriginContactName}
            autoCapitalize="words"
          />
          <Input style={CreateShipmentScreenStyle.details}
            placeholder="Teléfono de contacto (opcional)"
            value={originContactPhone}
            onChangeText={setOriginContactPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* DESTINO */}
        <View style={CreateShipmentScreenStyle.section}>
          <Text style={CreateShipmentScreenStyle.sectionTitle}> Destino</Text>
          
          {GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' ? (
            <>
              <AddressAutocomplete
                onSelectAddress={setDestinationLocation}
                placeholder="Buscar dirección de destino"
                apiKey={GOOGLE_MAPS_CONFIG.apiKey}
                value={destinationLocation?.address || ''}
              />
              
              <TouchableOpacity
                style={CreateShipmentScreenStyle.mapButton}
                onPress={() => setShowDestinationMap(true)}
              >
                <Text style={CreateShipmentScreenStyle.mapButtonText}>
                  {destinationLocation ? 'Cambiar ubicación en el mapa' : 'Seleccionar en el mapa'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={CreateShipmentScreenStyle.warningBox}>
              <Text style={CreateShipmentScreenStyle.warningText}>
                Configura tu Google Maps API Key
              </Text>
            </View>
          )}

          {destinationLocation && (
            <View style={CreateShipmentScreenStyle.selectedLocation}>
              <Text style={CreateShipmentScreenStyle.selectedLocationText}>
                ✓ {destinationLocation.address}
              </Text>
            </View>
          )}

          <Input style={CreateShipmentScreenStyle.details}
            placeholder="Nombre de contacto (opcional)"
            value={destinationContactName}
            onChangeText={setDestinationContactName}
            autoCapitalize="words"
          />
          <Input style={CreateShipmentScreenStyle.details}
            placeholder="Teléfono de contacto (opcional)"
            value={destinationContactPhone}
            onChangeText={setDestinationContactPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* TIPO DE CARGA */}
        <View style={CreateShipmentScreenStyle.section}>
          <Text style={CreateShipmentScreenStyle.sectionTitle}>📦 Tipo de Carga</Text>
          <View style={CreateShipmentScreenStyle.cargoTypeContainer}>
            {CARGO_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  CreateShipmentScreenStyle.cargoTypeButton,
                  cargoType === type.value && CreateShipmentScreenStyle.cargoTypeButtonActive,
                ]}
                onPress={() => setCargoType(type.value)}
              >
                <Text
                  style={[
                    CreateShipmentScreenStyle.cargoTypeText,
                    cargoType === type.value && CreateShipmentScreenStyle.cargoTypeTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* DETALLES DE CARGA */}
        <View style={CreateShipmentScreenStyle.section}>
          <Text style={CreateShipmentScreenStyle.sectionTitle}>📋 Detalles de la Carga</Text>
          <Input style={CreateShipmentScreenStyle.details}
            placeholder="Descripción de la carga"
            value={cargoDescription}
            onChangeText={setCargoDescription}
            autoCapitalize="sentences"
            
          />
          <View style={CreateShipmentScreenStyle.row}>
            <View style={CreateShipmentScreenStyle.halfInput}>
              <Input style={CreateShipmentScreenStyle.details}
                placeholder="Peso (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
            <View style={CreateShipmentScreenStyle.halfInput}>
              <Input style={CreateShipmentScreenStyle.details}
                placeholder="Precio ($)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={CreateShipmentScreenStyle.textAreaContainer}>
            <RNTextInput
              style={CreateShipmentScreenStyle.textArea}
              placeholder="Notas adicionales (opcional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={CreateShipmentScreenStyle.buttonContainer}>
          <Button
            title={loading ? 'Creando...' : 'Crear Envío'}
            onPress={handleCreateShipment}
            disabled={loading}
          />
          <TouchableOpacity
            style={CreateShipmentScreenStyle.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={CreateShipmentScreenStyle.cancelButtonText}>Cancelar</Text>
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
