import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking, Platform, StyleSheet } from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ActiveShipmentScreenStyles from '@presentation/theme/Trans-Screen-Styles/ActiveShipmentScreenStyles';

const API_BASE_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

interface Props {
  route: any;
  navigation: any;
}

type NavigationPhase = 'pickup' | 'delivery';

export const ActiveShipmentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { shipmentId } = route.params;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [phase, setPhase] = useState<NavigationPhase>('pickup');

  const loadShipmentDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar el envío');
      }
      
      setShipment(data);
      
      // Determinar la fase según el estado
      if (data.status === ShipmentStatus.IN_TRANSIT) {
        setPhase('delivery');
      } else {
        setPhase('pickup');
      }
    } catch (error: any) {
      console.error('Error loading shipment details:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles del envío');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipmentDetails();
  }, []);

  const openGoogleMaps = (latitude: number, longitude: number, address: string) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = encodeURIComponent(address);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'No se pudo abrir Google Maps');
      });
    }
  };

  const handleStartPickup = async () => {
    if (!shipment) return;

    try {
      setUpdating(true);
      
      const response = await fetch(`${API_BASE_URL}/shipments/startPickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId, driverId: shipment.driverId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo iniciar el viaje');
      }
      
      Alert.alert('Éxito', data.message || 'Viaje iniciado. Dirígete a recoger el pedido.');
      await loadShipmentDetails();
    } catch (error: any) {
      console.error('Error starting pickup:', error);
      Alert.alert('Error', error.message || 'No se pudo iniciar el viaje');
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmPickup = () => {
    Alert.alert(
      'Confirmar Recogida',
      '¿Has recogido el pedido?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, continuar',
          onPress: () => {
            setPhase('delivery');
            Alert.alert('Perfecto', 'Ahora dirígete al destino para entregar el pedido');
          },
        },
      ]
    );
  };

  const handleNavigateToDestination = () => {
    if (!shipment) return;
    openGoogleMaps(
      shipment.destination.latitude,
      shipment.destination.longitude,
      shipment.destination.address
    );
  };

  const handleConfirmDelivery = async () => {
    if (!shipment) return;

    Alert.alert(
      'Confirmar Entrega',
      '¿Has entregado el pedido al cliente?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, marcar como entregado',
          onPress: async () => {
            try {
              setUpdating(true);
              
              const response = await fetch(`${API_BASE_URL}/shipments/confirmDelivery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipmentId, driverId: shipment.driverId }),
              });
              
              const data = await response.json();
              
              if (!response.ok) {
                throw new Error(data.error || 'No se pudo marcar como entregado');
              }
              
              Alert.alert('Éxito', data.message || 'Envío marcado como entregado', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navegar al home (ir dos pantallas atrás: ActiveShipment -> MyShipmentDetails -> Home)
                    navigation.navigate('HomeMain');
                  },
                },
              ]);
            } catch (error: any) {
              console.error('Error marking as delivered:', error);
              Alert.alert('Error', error.message || 'No se pudo marcar como entregado');
            } finally {
              setUpdating(true);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={ActiveShipmentScreenStyles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={ActiveShipmentScreenStyles.centerContainer}>
        <Text style={ActiveShipmentScreenStyles.errorText}>No se encontró el envío</Text>
      </View>
    );
  }

  return (
    <ScrollView style={ActiveShipmentScreenStyles.container}>
      {/* Indicador de Fase */}
      <View style={ActiveShipmentScreenStyles.phaseIndicator}>
        <View style={[ActiveShipmentScreenStyles.phaseStep, phase === 'pickup' && ActiveShipmentScreenStyles.phaseStepActive]}>
          <FontAwesome 
            name={phase === 'delivery' ? 'check-circle' : 'map-marker'} 
            size={24} 
            color={phase === 'delivery' ? '#10B981' : '#10B981'} 
          />
          <Text style={[ActiveShipmentScreenStyles.phaseText, phase === 'pickup' && ActiveShipmentScreenStyles.phaseTextActive]}>
            Recoger
          </Text>
        </View>
        
        <View style={ActiveShipmentScreenStyles.phaseLine} />
        
        <View style={[ActiveShipmentScreenStyles.phaseStep, phase === 'delivery' && ActiveShipmentScreenStyles.phaseStepActive]}>
          <FontAwesome 
            name="flag-checkered" 
            size={24} 
            color={phase === 'delivery' ? '#10B981' : '#9CA3AF'} 
          />
          <Text style={[ActiveShipmentScreenStyles.phaseText, phase === 'delivery' && ActiveShipmentScreenStyles.phaseTextActive]}>
            Entregar
          </Text>
        </View>
      </View>

      {/* Información del Envío */}
      <View style={ActiveShipmentScreenStyles.card}>
        <Text style={ActiveShipmentScreenStyles.sectionTitle}>Información del Envío</Text>
        <View style={ActiveShipmentScreenStyles.infoRow}>
          <Text style={ActiveShipmentScreenStyles.infoLabel}>ID:</Text>
          <Text style={ActiveShipmentScreenStyles.infoValue}>#{shipmentId.slice(0, 8).toUpperCase()}</Text>
        </View>
        <View style={ActiveShipmentScreenStyles.infoRow}>
          <Text style={ActiveShipmentScreenStyles.infoLabel}>Carga:</Text>
          <Text style={ActiveShipmentScreenStyles.infoValue}>{shipment.cargoDescription}</Text>
        </View>
        <View style={ActiveShipmentScreenStyles.infoRow}>
          <Text style={ActiveShipmentScreenStyles.infoLabel}>Peso:</Text>
          <Text style={ActiveShipmentScreenStyles.infoValue}>{shipment.weight} kg</Text>
        </View>
      </View>

      {/* FASE DE RECOGIDA */}
      {phase === 'pickup' && (
        <>
          <View style={ActiveShipmentScreenStyles.card}>
            <View style={ActiveShipmentScreenStyles.cardHeader}>
              <FontAwesome name="map-marker" size={20} color="#10B981" />
              <Text style={ActiveShipmentScreenStyles.cardTitle}>Punto de Recogida</Text>
            </View>
            
            <Text style={ActiveShipmentScreenStyles.address}>{shipment.origin.address}</Text>
            
            {shipment.origin.contactName && (
              <View style={ActiveShipmentScreenStyles.contactInfo}>
                <Text style={ActiveShipmentScreenStyles.contactLabel}>Contacto:</Text>
                <Text style={ActiveShipmentScreenStyles.contactValue}>{shipment.origin.contactName}</Text>
                {shipment.origin.contactPhone && (
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(`tel:${shipment.origin.contactPhone}`)}
                    style={ActiveShipmentScreenStyles.phoneButton}
                  >
                    <FontAwesome name="phone" size={16} color="#10B981" />
                    <Text style={ActiveShipmentScreenStyles.phoneText}>{shipment.origin.contactPhone}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={ActiveShipmentScreenStyles.mapsButton}
              onPress={() => openGoogleMaps(
                shipment.origin.latitude,
                shipment.origin.longitude,
                shipment.origin.address
              )}
            >
              <FontAwesome name="map" size={18} color="#fff" />
              <Text style={ActiveShipmentScreenStyles.mapsButtonText}>Abrir en Google Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={ActiveShipmentScreenStyles.actionsContainer}>
            {shipment.status === ShipmentStatus.ACCEPTED ? (
              <Button
                title="Iniciar Viaje"
                onPress={handleStartPickup}
                disabled={updating}
              />
            ) : (
              <Button
                title="Confirmar Recogida"
                onPress={handleConfirmPickup}
                disabled={updating}
              />
            )}
          </View>
        </>
      )}

      {/* FASE DE ENTREGA */}
      {phase === 'delivery' && (
        <>
          <View style={ActiveShipmentScreenStyles.card}>
            <View style={ActiveShipmentScreenStyles.cardHeader}>
              <FontAwesome name="flag-checkered" size={20} color="#10B981" />
              <Text style={ActiveShipmentScreenStyles.cardTitle}>Punto de Entrega</Text>
            </View>
            
            <Text style={ActiveShipmentScreenStyles.address}>{shipment.destination.address}</Text>
            
            {shipment.destination.contactName && (
              <View style={ActiveShipmentScreenStyles.contactInfo}>
                <Text style={ActiveShipmentScreenStyles.contactLabel}>Contacto:</Text>
                <Text style={ActiveShipmentScreenStyles.contactValue}>{shipment.destination.contactName}</Text>
                {shipment.destination.contactPhone && (
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(`tel:${shipment.destination.contactPhone}`)}
                    style={ActiveShipmentScreenStyles.phoneButton}
                  >
                    <FontAwesome name="phone" size={16} color="#10B981" />
                    <Text style={ActiveShipmentScreenStyles.phoneText}>{shipment.destination.contactPhone}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={ActiveShipmentScreenStyles.mapsButton}
              onPress={handleNavigateToDestination}
            >
              <FontAwesome name="map" size={18} color="#fff" />
              <Text style={ActiveShipmentScreenStyles.mapsButtonText}>Abrir en Google Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={ActiveShipmentScreenStyles.actionsContainer}>
            <Button
              title="Marcar como Entregado"
              onPress={handleConfirmDelivery}
              disabled={updating}
            />
          </View>
        </>
      )}

      {shipment.notes && (
        <View style={ActiveShipmentScreenStyles.card}>
          <Text style={ActiveShipmentScreenStyles.sectionTitle}>Notas Adicionales</Text>
          <Text style={ActiveShipmentScreenStyles.notesText}>{shipment.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
};