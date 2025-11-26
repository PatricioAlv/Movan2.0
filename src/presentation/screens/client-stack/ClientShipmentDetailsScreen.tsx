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
} from 'react-native';
import { styles } from '@presentation/theme/Client-Screen-Styles/ClientShipmentDetailsStyle';
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
      return '#FFA500';
    case ShipmentStatus.ACCEPTED:
      return '#4169E1';
    case ShipmentStatus.IN_TRANSIT:
      return '#9370DB';
    case ShipmentStatus.DELIVERED:
      return '#32CD32';
    case ShipmentStatus.CANCELLED:
      return '#DC143C';
    default:
      return '#6B7280';
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
          <ActivityIndicator size="large" color="#4A90E2" />
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
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
              <Text style={styles.statusText}>{getStatusText(shipment.status)}</Text>
            </View>
          </View>
        </View>

        {/* Información del Transportista */}
        {shipment.driverId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚛 TRANSPORTISTA ASIGNADO</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverHeader}>
                <View style={styles.driverAvatar}>
                  <FontAwesome name="user" size={30} color="#FFFFFF" />
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{shipment.driverName || 'Transportista'}</Text>
                  {shipment.driverEmail && (
                    <Text style={styles.driverEmail}>{shipment.driverEmail}</Text>
                  )}
                  {shipment.driverPhone && (
                    <Text style={styles.driverPhone}>📱 {shipment.driverPhone}</Text>
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
          <Text style={styles.sectionTitle}>📍 RUTA</Text>
          <View style={styles.routeCard}>
            <View style={styles.locationRow}>
              <View style={styles.locationDot}>
                <View style={styles.originDot} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Origen</Text>
                <Text style={styles.locationAddress}>{shipment.origin.address}</Text>
                {shipment.origin.contactName && (
                  <Text style={styles.contactInfo}>
                    👤 {shipment.origin.contactName}
                  </Text>
                )}
                {shipment.origin.contactPhone && (
                  <Text style={styles.contactInfo}>
                    📞 {shipment.origin.contactPhone}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.locationRow}>
              <View style={styles.locationDot}>
                <View style={styles.destinationDot} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Destino</Text>
                <Text style={styles.locationAddress}>{shipment.destination.address}</Text>
                {shipment.destination.contactName && (
                  <Text style={styles.contactInfo}>
                    👤 {shipment.destination.contactName}
                  </Text>
                )}
                {shipment.destination.contactPhone && (
                  <Text style={styles.contactInfo}>
                    📞 {shipment.destination.contactPhone}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Detalles de la Carga */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 DETALLES DE LA CARGA</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo de carga</Text>
              <Text style={styles.detailValue}>{shipment.cargoType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Descripción</Text>
              <Text style={styles.detailValue}>{shipment.cargoDescription}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Peso</Text>
              <Text style={styles.detailValue}>{shipment.weight} kg</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Precio</Text>
              <Text style={styles.priceValue}>${shipment.price.toLocaleString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha de recogida</Text>
              <Text style={styles.detailValue}>
                {new Date(shipment.pickupDate).toLocaleDateString('es-MX')}
              </Text>
            </View>
            {shipment.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notas</Text>
                <Text style={styles.detailValue}>{shipment.notes}</Text>
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
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome name="times-circle" size={18} color="#FFFFFF" />
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
