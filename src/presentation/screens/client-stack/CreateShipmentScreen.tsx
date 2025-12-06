import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { AddressAutocomplete } from '@presentation/components/common/AddressAutocomplete';
import { LocationPicker } from '@presentation/components/common/LocationPicker';
import { CargoType } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CreateShipmentScreenStyle from '@presentation/theme/Client-Screen-Styles/CreateShipmentScreenStyle';

const API_BASE_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

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
    <SafeAreaView style={CreateShipmentScreenStyle.container}>
      <ScrollView
        contentContainerStyle={CreateShipmentScreenStyle.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={CreateShipmentScreenStyle.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={CreateShipmentScreenStyle.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={CreateShipmentScreenStyle.title}>Nuevo Envío</Text>
          <TouchableOpacity onPress={handleUseExampleData} style={CreateShipmentScreenStyle.exampleButton}>
            <FontAwesome name="magic" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* ORIGEN */}
        <View style={[CreateShipmentScreenStyle.section, { zIndex: 2000 }]}>
          <View style={CreateShipmentScreenStyle.sectionHeader}>
            <FontAwesome name="map-marker" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={CreateShipmentScreenStyle.sectionTitle}>Origen</Text>
          </View>
          
          <View style={[CreateShipmentScreenStyle.autocompleteContainer, { zIndex: 2000 }]}>
            <AddressAutocomplete 
              onSelectAddress={setOriginLocation}
              placeholder="Buscar dirección de origen"
              value={originLocation?.address || ''}
              inputStyle={CreateShipmentScreenStyle.input}
            />
          </View>
          
          <TouchableOpacity
            style={CreateShipmentScreenStyle.mapButton}
            onPress={() => setShowOriginMap(true)}
          >
            <FontAwesome name="map" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={CreateShipmentScreenStyle.mapButtonText}>
              {originLocation ? 'Cambiar ubicación en el mapa' : 'Seleccionar en el mapa'}
            </Text>
          </TouchableOpacity>

          {originLocation && (
            <View style={CreateShipmentScreenStyle.selectedLocation}>
              <FontAwesome name="check-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={CreateShipmentScreenStyle.selectedLocationText}>
                {originLocation.address}
              </Text>
            </View>
          )}

          <View style={CreateShipmentScreenStyle.inputContainer}>
            <Text style={CreateShipmentScreenStyle.inputLabel}>Nombre de contacto</Text>
            <RNTextInput
              style={CreateShipmentScreenStyle.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={originContactName}
              onChangeText={setOriginContactName}
              autoCapitalize="words"
            />
          </View>
          <View style={CreateShipmentScreenStyle.inputContainer}>
            <Text style={CreateShipmentScreenStyle.inputLabel}>Teléfono de contacto</Text>
            <RNTextInput
              style={CreateShipmentScreenStyle.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={originContactPhone}
              onChangeText={setOriginContactPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* DESTINO */}
        <View style={[CreateShipmentScreenStyle.section, { zIndex: 1000 }]}>
          <View style={CreateShipmentScreenStyle.sectionHeader}>
            <FontAwesome name="flag" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={CreateShipmentScreenStyle.sectionTitle}>Destino</Text>
          </View>
          
          <View style={[CreateShipmentScreenStyle.autocompleteContainer, { zIndex: 1000 }]}>
            <AddressAutocomplete
              onSelectAddress={setDestinationLocation}
              placeholder="Buscar dirección de destino"
              value={destinationLocation?.address || ''}
              inputStyle={CreateShipmentScreenStyle.input}
            />
          </View>
          
          <TouchableOpacity
            style={CreateShipmentScreenStyle.mapButton}
            onPress={() => setShowDestinationMap(true)}
          >
            <FontAwesome name="map" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={CreateShipmentScreenStyle.mapButtonText}>
              {destinationLocation ? 'Cambiar ubicación en el mapa' : 'Seleccionar en el mapa'}
            </Text>
          </TouchableOpacity>

          {destinationLocation && (
            <View style={CreateShipmentScreenStyle.selectedLocation}>
              <FontAwesome name="check-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={CreateShipmentScreenStyle.selectedLocationText}>
                {destinationLocation.address}
              </Text>
            </View>
          )}

          <View style={CreateShipmentScreenStyle.inputContainer}>
            <Text style={CreateShipmentScreenStyle.inputLabel}>Nombre de contacto</Text>
            <RNTextInput
              style={CreateShipmentScreenStyle.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={destinationContactName}
              onChangeText={setDestinationContactName}
              autoCapitalize="words"
            />
          </View>
          <View style={CreateShipmentScreenStyle.inputContainer}>
            <Text style={CreateShipmentScreenStyle.inputLabel}>Teléfono de contacto</Text>
            <RNTextInput
              style={CreateShipmentScreenStyle.input}
              placeholder="Opcional"
              placeholderTextColor="#64748B"
              value={destinationContactPhone}
              onChangeText={setDestinationContactPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* TIPO DE CARGA */}
        <View style={CreateShipmentScreenStyle.section}>
          <View style={CreateShipmentScreenStyle.sectionHeader}>
            <FontAwesome name="cube" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={CreateShipmentScreenStyle.sectionTitle}>Tipo de Carga</Text>
          </View>
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
          <View style={CreateShipmentScreenStyle.sectionHeader}>
            <FontAwesome name="list-alt" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={CreateShipmentScreenStyle.sectionTitle}>Detalles de la Carga</Text>
          </View>
          
          <View style={CreateShipmentScreenStyle.inputContainer}>
            <Text style={CreateShipmentScreenStyle.inputLabel}>Descripción</Text>
            <RNTextInput
              style={CreateShipmentScreenStyle.input}
              placeholder="Ej: Muebles de oficina"
              placeholderTextColor="#64748B"
              value={cargoDescription}
              onChangeText={setCargoDescription}
              autoCapitalize="sentences"
            />
          </View>

          <View style={CreateShipmentScreenStyle.row}>
            <View style={CreateShipmentScreenStyle.halfInput}>
              <View style={CreateShipmentScreenStyle.inputContainer}>
                <Text style={CreateShipmentScreenStyle.inputLabel}>Peso (kg)</Text>
                <RNTextInput
                  style={CreateShipmentScreenStyle.input}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={CreateShipmentScreenStyle.halfInput}>
              <View style={CreateShipmentScreenStyle.inputContainer}>
                <Text style={CreateShipmentScreenStyle.inputLabel}>Precio ($)</Text>
                <RNTextInput
                  style={CreateShipmentScreenStyle.input}
                  placeholder="0.00"
                  placeholderTextColor="#64748B"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          
          <View style={CreateShipmentScreenStyle.inputContainer}>
            <Text style={CreateShipmentScreenStyle.inputLabel}>Notas adicionales</Text>
            <RNTextInput
              style={[CreateShipmentScreenStyle.input, CreateShipmentScreenStyle.textArea]}
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

        <View style={CreateShipmentScreenStyle.buttonContainer}>
          <TouchableOpacity
            style={[CreateShipmentScreenStyle.createButton, loading && CreateShipmentScreenStyle.disabledButton]}
            onPress={handleCreateShipment}
            disabled={loading}
          >
            {loading ? (
              <Text style={CreateShipmentScreenStyle.createButtonText}>Creando...</Text>
            ) : (
              <>
                <FontAwesome name="check" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={CreateShipmentScreenStyle.createButtonText}>Crear Envío</Text>
              </>
            )}
          </TouchableOpacity>
          
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
