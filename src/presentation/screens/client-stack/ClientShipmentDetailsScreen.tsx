import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { GetShipmentByIdUseCase } from '@core/usecases/shipments/GetShipmentByIdUseCase';
import { CancelShipmentUseCase } from '@core/usecases/shipments/CancelShipmentUseCase';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props {
  route: any;
  navigation: any;
}

const getStatusColor = (status: ShipmentStatus): string => {
  switch (status) {
    case ShipmentStatus.PENDING:
      return '#F59E0B'; // Orange
    case ShipmentStatus.ACCEPTED:
      return '#3B82F6'; // Blue
    case ShipmentStatus.IN_TRANSIT:
      return '#3B82F6'; // Blue
    case ShipmentStatus.DELIVERED:
      return '#10B981'; // Green
    case ShipmentStatus.CANCELLED:
      return '#EF4444'; // Red
    default:
      return '#9CA3AF';
  }
};

const getStatusBgColor = (status: ShipmentStatus): string => {
  switch (status) {
    case ShipmentStatus.PENDING:
      return 'rgba(245, 158, 11, 0.15)'; // Orange with opacity
    case ShipmentStatus.ACCEPTED:
      return 'rgba(59, 130, 246, 0.15)'; // Blue with opacity
    case ShipmentStatus.IN_TRANSIT:
      return 'rgba(59, 130, 246, 0.15)'; // Blue with opacity
    case ShipmentStatus.DELIVERED:
      return 'rgba(16, 185, 129, 0.15)'; // Green with opacity
    case ShipmentStatus.CANCELLED:
      return 'rgba(239, 68, 68, 0.15)'; // Red with opacity
    default:
      return 'rgba(156, 163, 175, 0.15)';
  }
};

const getStatusText = (status: ShipmentStatus): string => {
  switch (status) {
    case ShipmentStatus.PENDING:
      return 'Pendiente de asignación';
    case ShipmentStatus.ACCEPTED:
      return 'Aceptado por transportista';
    case ShipmentStatus.IN_TRANSIT:
      return 'En tránsito';
    case ShipmentStatus.DELIVERED:
      return 'Entregado';
    case ShipmentStatus.CANCELLED:
      return 'Cancelado';
    default:
      return status;
  }
};

export const ClientShipmentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { shipmentId } = route.params;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const getShipmentUseCase = container.get<GetShipmentByIdUseCase>(TYPES.GetShipmentByIdUseCase);
  const cancelShipmentUseCase = container.get<CancelShipmentUseCase>(TYPES.CancelShipmentUseCase);

  useEffect(() => {
    loadShipmentDetails();
  }, []);

  const loadShipmentDetails = async () => {
    try {
      setLoading(true);
      const shipmentData = await getShipmentUseCase.execute(shipmentId);
      
      if (!shipmentData) {
        Alert.alert('Error', 'No se encontró el envío');
        navigation.goBack();
        return;
      }

      setShipment(shipmentData);
    } catch (error: any) {
      console.error('Error loading shipment:', error);
      Alert.alert('Error', 'No se pudo cargar la información del envío');
    } finally {
      setLoading(false);
    }
  };

  const handleCallDriver = () => {
    if (shipment?.driverPhone) {
      Linking.openURL(`tel:${shipment.driverPhone}`);
    } else {
      Alert.alert('Información', 'El transportista no tiene teléfono registrado');
    }
  };

  const handleCancelShipment = () => {
    Alert.alert(
      'Cancelar Envío',
      '¿Estás seguro de que deseas cancelar este envío?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await cancelShipmentUseCase.execute(shipmentId);
              Alert.alert('Éxito', 'Envío cancelado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo cancelar el envío');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No se encontró el envío</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Envío</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ID y Estado */}
        <View style={styles.section}>
          <View style={styles.headerInfo}>
            <Text style={styles.shipmentId}>#{shipment.id.slice(0, 8).toUpperCase()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(shipment.status) }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(shipment.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(shipment.status) }]}>
                {getStatusText(shipment.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Información del Transportista */}
        {shipment.driverId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRANSPORTISTA ASIGNADO</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverHeader}>
                <View style={styles.driverAvatar}>
                  <FontAwesome name="user" size={24} color="#10B981" />
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{shipment.driverName || 'Transportista'}</Text>
                  {shipment.driverEmail && (
                    <Text style={styles.driverEmail}>{shipment.driverEmail}</Text>
                  )}
                  {shipment.driverPhone && (
                    <Text style={styles.driverPhone}>
                      <FontAwesome name="phone" size={12} color="#94A3B8" /> {shipment.driverPhone}
                    </Text>
                  )}
                  {!shipment.driverName && (
                    <Text style={styles.infoNote}>
                      ID: {shipment.driverId.slice(0, 8).toUpperCase()}
                    </Text>
                  )}
                </View>
              </View>
              {shipment.driverPhone && (
                <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
                  <FontAwesome name="phone" size={16} color="#FFFFFF" />
                  <Text style={styles.callButtonText}>Llamar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Ruta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RUTA</Text>
          <View style={styles.routeCard}>
            <View style={styles.locationRow}>
              <View style={styles.locationDot}>
                <FontAwesome name="arrow-up" size={16} color="#10B981" />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Origen</Text>
                <Text style={styles.locationAddress}>{shipment.origin.address}</Text>
                {shipment.origin.contactName && (
                  <Text style={styles.contactInfo}>
                    <FontAwesome name="user" size={12} color="#10B981" /> {shipment.origin.contactName}
                  </Text>
                )}
                {shipment.origin.contactPhone && (
                  <Text style={styles.contactInfo}>
                    <FontAwesome name="phone" size={12} color="#10B981" /> {shipment.origin.contactPhone}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.routeLineContainer}>
              <View style={styles.routeLine} />
            </View>

            <View style={styles.locationRow}>
              <View style={styles.locationDot}>
                <FontAwesome name="arrow-down" size={16} color="#10B981" />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Destino</Text>
                <Text style={styles.locationAddress}>{shipment.destination.address}</Text>
                {shipment.destination.contactName && (
                  <Text style={styles.contactInfo}>
                    <FontAwesome name="user" size={12} color="#10B981" /> {shipment.destination.contactName}
                  </Text>
                )}
                {shipment.destination.contactPhone && (
                  <Text style={styles.contactInfo}>
                    <FontAwesome name="phone" size={12} color="#10B981" /> {shipment.destination.contactPhone}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Detalles de la Carga */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLES DE LA CARGA</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <FontAwesome name="cube" size={16} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Tipo de carga</Text>
                <Text style={styles.detailValue}>{shipment.cargoType}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <FontAwesome name="align-left" size={16} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Descripción</Text>
                <Text style={styles.detailValue}>{shipment.cargoDescription}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <FontAwesome name="balance-scale" size={16} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Peso</Text>
                <Text style={styles.detailValue}>{shipment.weight} kg</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <FontAwesome name="dollar" size={16} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Precio</Text>
                <Text style={styles.priceValue}>${shipment.price.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <FontAwesome name="calendar" size={16} color="#10B981" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha de recogida</Text>
                <Text style={styles.detailValue}>
                  {new Date(shipment.pickupDate).toLocaleDateString('es-MX')}
                </Text>
              </View>
            </View>
            {shipment.notes && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <FontAwesome name="sticky-note" size={16} color="#10B981" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Notas</Text>
                  <Text style={styles.detailValue}>{shipment.notes}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Botón de cancelar (solo si está pendiente) */}
        {shipment.status === ShipmentStatus.PENDING && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelShipment}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <>
                  <FontAwesome name="times-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text style={styles.cancelButtonText}>Cancelar Envío</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shipmentId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  driverCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  driverEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  driverPhone: {
    fontSize: 12,
    color: '#94A3B8',
  },
  infoNote: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  callButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  routeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDot: {
    width: 24,
    alignItems: 'center',
    marginTop: 2,
  },
  locationDetails: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  routeLineContainer: {
    width: 24,
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
  },
  routeLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#334155',
  },
  detailsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  detailIcon: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  priceValue: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: 'bold',
  },
  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
