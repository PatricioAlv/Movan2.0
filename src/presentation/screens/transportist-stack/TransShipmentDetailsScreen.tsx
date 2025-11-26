import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking, Platform } from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { GetShipmentByIdUseCase } from '@core/usecases/shipments/GetShipmentByIdUseCase';
import { AcceptShipmentUseCase } from '@core/usecases/shipments/AcceptShipmentUseCase';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import { auth } from '@data/config/firebase.config';
import { StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props {
  route: any;
  navigation: any;
}

export const TransShipmentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { shipmentId } = route.params;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  const loadShipmentDetails = async () => {
    try {
      const getShipmentUseCase = container.get<GetShipmentByIdUseCase>(
        TYPES.GetShipmentByIdUseCase
      );
      const data = await getShipmentUseCase.execute(shipmentId);
      setShipment(data);
    } catch (error: any) {
      console.error('Error loading shipment details:', error);
      Alert.alert('Error', 'No se pudieron cargar los detalles del pedido');
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

    Linking.openURL(url || `https://www.google.com/maps/search/?api=1&query=${latLng}`);
  };

  const handleAcceptShipment = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener tu información de usuario');
      return;
    }

    Alert.alert(
      'Aceptar Pedido',
      '¿Estás seguro de que quieres aceptar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              setAccepting(true);
              const acceptShipmentUseCase = container.get<AcceptShipmentUseCase>(
                TYPES.AcceptShipmentUseCase
              );
              await acceptShipmentUseCase.execute(shipmentId, userId);
              
              Alert.alert('Éxito', 'Pedido aceptado correctamente', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Volver atrás dos veces: de detalles a buscador, de buscador a home
                    navigation.goBack();
                    setTimeout(() => {
                      navigation.getParent()?.navigate('TransHome');
                    }, 100);
                  },
                },
              ]);
            } catch (error: any) {
              console.error('Error accepting shipment:', error);
              Alert.alert('Error', error.message || 'No se pudo aceptar el pedido');
            } finally {
              setAccepting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró el pedido</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const canAccept = shipment.status === ShipmentStatus.PENDING && !shipment.driverId;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Map Placeholder */}
        <View style={styles.mapCard}>
          <TouchableOpacity 
            style={styles.mapPlaceholder}
            onPress={() => openGoogleMaps(
              shipment.origin.latitude,
              shipment.origin.longitude,
              shipment.origin.address
            )}
          >
            <FontAwesome name="map" size={40} color="#4B5563" />
            <Text style={styles.mapPlaceholderText}>Ver Ruta en Mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Price Card */}
        <View style={styles.card}>
          <Text style={styles.priceText}>${shipment.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD</Text>
          <View style={styles.metaRow}>
             <Text style={styles.metaText}>850 km</Text>
             <Text style={styles.metaText}>10h 30m</Text>
          </View>
        </View>

        {/* Points Section */}
        <Text style={styles.sectionTitle}>Puntos de Recogida y Entrega</Text>
        <View style={styles.card}>
          {/* Origin */}
          <View style={styles.pointRow}>
            <View style={styles.iconContainer}>
               <FontAwesome name="arrow-up" size={14} color="#10B981" />
            </View>
            <View style={styles.pointDetails}>
               <Text style={styles.pointAddress} numberOfLines={2}>{shipment.origin.address}</Text>
               <Text style={styles.pointDate}>
                 {new Date(shipment.pickupDate).toLocaleDateString('es-ES', { 
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                 })}
               </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Destination */}
          <View style={styles.pointRow}>
            <View style={styles.iconContainer}>
               <FontAwesome name="arrow-down" size={14} color="#10B981" />
            </View>
            <View style={styles.pointDetails}>
               <Text style={styles.pointAddress} numberOfLines={2}>{shipment.destination.address}</Text>
               <Text style={styles.pointDate}>
                 {shipment.deliveryDate 
                   ? new Date(shipment.deliveryDate).toLocaleDateString('es-ES', { 
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                     })
                   : 'Fecha por definir'}
               </Text>
            </View>
          </View>
        </View>

        {/* Cargo Details */}
        <Text style={styles.sectionTitle}>Detalles de la Carga</Text>
        <View style={styles.card}>
           <View style={styles.detailItem}>
              <FontAwesome name="cube" size={16} color="#10B981" style={styles.detailIcon} />
              <Text style={styles.detailText}>{shipment.cargoType}</Text>
           </View>
           <View style={styles.detailItem}>
              <FontAwesome name="balance-scale" size={16} color="#10B981" style={styles.detailIcon} />
              <Text style={styles.detailText}>{shipment.weight} kg</Text>
           </View>
           <View style={styles.detailItem}>
              <FontAwesome name="arrows-alt" size={16} color="#10B981" style={styles.detailIcon} />
              <Text style={styles.detailText}>4.5m x 2.5m x 3.0m</Text>
           </View>
        </View>

        {/* Client Info */}
        <Text style={styles.sectionTitle}>Información del Cliente</Text>
        <View style={styles.card}>
           <View style={styles.clientRow}>
              <View style={styles.clientInfo}>
                 <Text style={styles.clientName}>{shipment.origin.contactName || 'Cliente'}</Text>
                 <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={12} color="#FBBF24" />
                    <FontAwesome name="star" size={12} color="#FBBF24" />
                    <FontAwesome name="star" size={12} color="#FBBF24" />
                    <FontAwesome name="star" size={12} color="#FBBF24" />
                    <FontAwesome name="star-half-full" size={12} color="#FBBF24" />
                    <Text style={styles.ratingText}>(4.1)</Text>
                 </View>
              </View>
              <TouchableOpacity style={styles.phoneButton}>
                 <FontAwesome name="phone" size={18} color="#10B981" />
              </TouchableOpacity>
           </View>
        </View>
        
        <View style={{ height: 100 }} /> 
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
         <TouchableOpacity style={styles.rejectButton} onPress={() => navigation.goBack()}>
            <Text style={styles.rejectButtonText}>Rechazar</Text>
         </TouchableOpacity>
         
         {canAccept ? (
            <TouchableOpacity 
              style={[styles.acceptButton, accepting && styles.disabledButton]} 
              onPress={handleAcceptShipment}
              disabled={accepting}
            >
               {accepting ? (
                 <ActivityIndicator color="#FFF" />
               ) : (
                 <Text style={styles.acceptButtonText}>Aceptar Carga</Text>
               )}
            </TouchableOpacity>
         ) : (
            <View style={[styles.acceptButton, styles.disabledButton]}>
               <Text style={styles.acceptButtonText}>No Disponible</Text>
            </View>
         )}
      </View>
    </View>
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
    padding: spacing.lg,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  mapCard: {
    height: 180,
    backgroundColor: '#1A1D21',
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  mapPlaceholderText: {
    color: '#9CA3AF',
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1A1D21',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginRight: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  pointDetails: {
    flex: 1,
  },
  pointAddress: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  pointDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2D32',
    marginVertical: spacing.md,
    marginLeft: 48,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailIcon: {
    width: 24,
    marginRight: spacing.sm,
    textAlign: 'center',
  },
  detailText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1D21',
    padding: spacing.md,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2A2D32',
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.md,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#2A2D32',
    paddingVertical: 14,
    borderRadius: 8,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  notAvailableContainer: {
    backgroundColor: '#2B2B2B',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  notAvailableText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: spacing.md,
  },
});
