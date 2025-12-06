import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking, Platform, StyleSheet } from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró el envío</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Indicador de Fase */}
      <View style={styles.phaseIndicator}>
        <View style={[styles.phaseStep, phase === 'pickup' && styles.phaseStepActive]}>
          <FontAwesome 
            name={phase === 'delivery' ? 'check-circle' : 'map-marker'} 
            size={24} 
            color={phase === 'delivery' ? '#10B981' : '#10B981'} 
          />
          <Text style={[styles.phaseText, phase === 'pickup' && styles.phaseTextActive]}>
            Recoger
          </Text>
        </View>
        
        <View style={styles.phaseLine} />
        
        <View style={[styles.phaseStep, phase === 'delivery' && styles.phaseStepActive]}>
          <FontAwesome 
            name="flag-checkered" 
            size={24} 
            color={phase === 'delivery' ? '#10B981' : '#9CA3AF'} 
          />
          <Text style={[styles.phaseText, phase === 'delivery' && styles.phaseTextActive]}>
            Entregar
          </Text>
        </View>
      </View>

      {/* Información del Envío */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información del Envío</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID:</Text>
          <Text style={styles.infoValue}>#{shipmentId.slice(0, 8).toUpperCase()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Carga:</Text>
          <Text style={styles.infoValue}>{shipment.cargoDescription}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Peso:</Text>
          <Text style={styles.infoValue}>{shipment.weight} kg</Text>
        </View>
      </View>

      {/* FASE DE RECOGIDA */}
      {phase === 'pickup' && (
        <>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome name="map-marker" size={20} color="#10B981" />
              <Text style={styles.cardTitle}>Punto de Recogida</Text>
            </View>
            
            <Text style={styles.address}>{shipment.origin.address}</Text>
            
            {shipment.origin.contactName && (
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Contacto:</Text>
                <Text style={styles.contactValue}>{shipment.origin.contactName}</Text>
                {shipment.origin.contactPhone && (
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(`tel:${shipment.origin.contactPhone}`)}
                    style={styles.phoneButton}
                  >
                    <FontAwesome name="phone" size={16} color="#10B981" />
                    <Text style={styles.phoneText}>{shipment.origin.contactPhone}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.mapsButton}
              onPress={() => openGoogleMaps(
                shipment.origin.latitude,
                shipment.origin.longitude,
                shipment.origin.address
              )}
            >
              <FontAwesome name="map" size={18} color="#fff" />
              <Text style={styles.mapsButtonText}>Abrir en Google Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsContainer}>
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
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome name="flag-checkered" size={20} color="#10B981" />
              <Text style={styles.cardTitle}>Punto de Entrega</Text>
            </View>
            
            <Text style={styles.address}>{shipment.destination.address}</Text>
            
            {shipment.destination.contactName && (
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Contacto:</Text>
                <Text style={styles.contactValue}>{shipment.destination.contactName}</Text>
                {shipment.destination.contactPhone && (
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(`tel:${shipment.destination.contactPhone}`)}
                    style={styles.phoneButton}
                  >
                    <FontAwesome name="phone" size={16} color="#10B981" />
                    <Text style={styles.phoneText}>{shipment.destination.contactPhone}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.mapsButton}
              onPress={handleNavigateToDestination}
            >
              <FontAwesome name="map" size={18} color="#fff" />
              <Text style={styles.mapsButtonText}>Abrir en Google Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsContainer}>
            <Button
              title="Marcar como Entregado"
              onPress={handleConfirmDelivery}
              disabled={updating}
            />
          </View>
        </>
      )}

      {shipment.notes && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notas Adicionales</Text>
          <Text style={styles.notesText}>{shipment.notes}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111315',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111315',
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D32',
  },
  phaseStep: {
    alignItems: 'center',
    opacity: 0.4,
  },
  phaseStepActive: {
    opacity: 1,
  },
  phaseText: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: '#9CA3AF',
  },
  phaseTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  phaseLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#2A2D32',
    marginHorizontal: spacing.md,
  },
  card: {
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D32',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  address: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  contactInfo: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: '#25282C',
    borderRadius: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: spacing.xs,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  phoneText: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: spacing.xs,
    textDecorationLine: 'underline',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  mapsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  actionsContainer: {
    padding: spacing.md,
  },
  notesText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});
