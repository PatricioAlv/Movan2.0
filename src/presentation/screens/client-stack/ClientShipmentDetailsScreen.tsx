import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, } from 'react-native';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { RatingModal } from '@presentation/components/common/RatingModal';
import { auth } from '@data/config/firebase.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ClientShipmentDetailsStyle from '@presentation/theme/Client-Screen-Styles/ClientShipmentDetailsStyle';

const API_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    loadShipmentDetails();
  }, []);

  const loadShipmentDetails = async () => {
    try {
      setLoading(true);
      
      // Obtener detalles del envío
      const response = await fetch(`${API_URL}/shipments/${shipmentId}`);
      if (!response.ok) {
        throw new Error('No se encontró el envío');
      }
      const shipmentData = await response.json();

      if (!shipmentData) {
        Alert.alert('Error', 'No se encontró el envío');
        navigation.goBack();
        return;
      }

      setShipment(shipmentData);
      
      // Verificar si ya calificó al transportista
      if (shipmentData.status === ShipmentStatus.DELIVERED && shipmentData.driverId) {
        const currentUserId = auth.currentUser?.uid;
        if (currentUserId) {
          const ratedResponse = await fetch(
            `${API_URL}/ratings/check/${shipmentData.id}/${currentUserId}`
          );
          if (ratedResponse.ok) {
            const { hasRated: rated } = await ratedResponse.json();
            setHasRated(rated);
          }
        }
      }
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

  const handleSubmitRating = async (rating: number, comment?: string) => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId || !shipment?.driverId) {
        throw new Error('No se pudo obtener la información necesaria');
      }

      const response = await fetch(`${API_URL}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: currentUserId,
          shipmentId: shipment.id,
          toUserId: shipment.driverId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar calificación');
      }

      Alert.alert('Éxito', 'Tu calificación ha sido enviada');
      setHasRated(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
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
              const response = await fetch(`${API_URL}/shipments/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipmentId }),
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo cancelar el envío');
              }
              
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
      <SafeAreaView style={ClientShipmentDetailsStyle.container}>
        <View style={ClientShipmentDetailsStyle.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={ClientShipmentDetailsStyle.loadingText}>Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!shipment) {
    return (
      <SafeAreaView style={ClientShipmentDetailsStyle.container}>
        <View style={ClientShipmentDetailsStyle.loadingContainer}>
          <Text style={ClientShipmentDetailsStyle.errorText}>No se encontró el envío</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ClientShipmentDetailsStyle.container}>
      {/* Header */}
      <View style={ClientShipmentDetailsStyle.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={ClientShipmentDetailsStyle.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={ClientShipmentDetailsStyle.headerTitle}>Detalles del Envío</Text>
        <View style={ClientShipmentDetailsStyle.placeholder} />
      </View>

      <ScrollView contentContainerStyle={ClientShipmentDetailsStyle.scrollContent}>
        {/* ID y Estado */}
        <View style={ClientShipmentDetailsStyle.section}>
          <View style={ClientShipmentDetailsStyle.headerInfo}>
            <Text style={ClientShipmentDetailsStyle.shipmentId}>#{shipment.id.slice(0, 8).toUpperCase()}</Text>
            <View style={[ClientShipmentDetailsStyle.statusBadge, { backgroundColor: getStatusBgColor(shipment.status) }]}>
              <View style={[ClientShipmentDetailsStyle.statusDot, { backgroundColor: getStatusColor(shipment.status) }]} />
              <Text style={[ClientShipmentDetailsStyle.statusText, { color: getStatusColor(shipment.status) }]}>
                {getStatusText(shipment.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Información del Transportista */}
        {shipment.driverId && (
          <View style={ClientShipmentDetailsStyle.section}>
            <Text style={ClientShipmentDetailsStyle.sectionTitle}>TRANSPORTISTA ASIGNADO</Text>
            <View style={ClientShipmentDetailsStyle.driverCard}>
              <View style={ClientShipmentDetailsStyle.driverHeader}>
                <View style={ClientShipmentDetailsStyle.driverAvatar}>
                  <FontAwesome name="user" size={24} color="#10B981" />
                </View>
                <View style={ClientShipmentDetailsStyle.driverInfo}>
                  <Text style={ClientShipmentDetailsStyle.driverName}>{shipment.driverName || 'Transportista'}</Text>
                  {shipment.driverEmail && (
                    <Text style={ClientShipmentDetailsStyle.driverEmail}>{shipment.driverEmail}</Text>
                  )}
                  {shipment.driverPhone && (
                    <Text style={ClientShipmentDetailsStyle.driverPhone}>
                      <FontAwesome name="phone" size={12} color="#94A3B8" /> {shipment.driverPhone}
                    </Text>
                  )}
                  {!shipment.driverName && (
                    <Text style={ClientShipmentDetailsStyle.infoNote}>
                      ID: {shipment.driverId.slice(0, 8).toUpperCase()}
                    </Text>
                  )}
                </View>
              </View>
              {shipment.driverPhone && (
                <TouchableOpacity style={ClientShipmentDetailsStyle.callButton} onPress={handleCallDriver}>
                  <FontAwesome name="phone" size={16} color="#FFFFFF" />
                  <Text style={ClientShipmentDetailsStyle.callButtonText}>Llamar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Sección de Calificación (solo si está entregado) */}
        {shipment.status === ShipmentStatus.DELIVERED && shipment.driverId && (
          <View style={ClientShipmentDetailsStyle.section}>
            <Text style={ClientShipmentDetailsStyle.sectionTitle}>CALIFICAR SERVICIO</Text>
            <View style={ClientShipmentDetailsStyle.ratingCard}>
              {hasRated ? (
                <View style={ClientShipmentDetailsStyle.ratedContainer}>
                  <FontAwesome name="check-circle" size={24} color="#10B981" />
                  <Text style={ClientShipmentDetailsStyle.ratedText}>Ya calificaste este servicio</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={ClientShipmentDetailsStyle.rateButton}
                  onPress={() => setShowRatingModal(true)}
                >
                  <FontAwesome name="star" size={20} color="#FFD700" />
                  <Text style={ClientShipmentDetailsStyle.rateButtonText}>Calificar Transportista</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Ruta */}
        <View style={ClientShipmentDetailsStyle.section}>
          <Text style={ClientShipmentDetailsStyle.sectionTitle}>RUTA</Text>
          <View style={ClientShipmentDetailsStyle.routeCard}>
            <View style={ClientShipmentDetailsStyle.locationRow}>
              <View style={ClientShipmentDetailsStyle.locationDot}>
                <FontAwesome name="arrow-up" size={16} color="#10B981" />
              </View>
              <View style={ClientShipmentDetailsStyle.locationDetails}>
                <Text style={ClientShipmentDetailsStyle.locationLabel}>Origen</Text>
                <Text style={ClientShipmentDetailsStyle.locationAddress}>{shipment.origin.address}</Text>
                {shipment.origin.contactName && (
                  <Text style={ClientShipmentDetailsStyle.contactInfo}>
                    <FontAwesome name="user" size={12} color="#10B981" /> {shipment.origin.contactName}
                  </Text>
                )}
                {shipment.origin.contactPhone && (
                  <Text style={ClientShipmentDetailsStyle.contactInfo}>
                    <FontAwesome name="phone" size={12} color="#10B981" /> {shipment.origin.contactPhone}
                  </Text>
                )}
              </View>
            </View>

            <View style={ClientShipmentDetailsStyle.routeLineContainer}>
              <View style={ClientShipmentDetailsStyle.routeLine} />
            </View>

            <View style={ClientShipmentDetailsStyle.locationRow}>
              <View style={ClientShipmentDetailsStyle.locationDot}>
                <FontAwesome name="arrow-down" size={16} color="#10B981" />
              </View>
              <View style={ClientShipmentDetailsStyle.locationDetails}>
                <Text style={ClientShipmentDetailsStyle.locationLabel}>Destino</Text>
                <Text style={ClientShipmentDetailsStyle.locationAddress}>{shipment.destination.address}</Text>
                {shipment.destination.contactName && (
                  <Text style={ClientShipmentDetailsStyle.contactInfo}>
                    <FontAwesome name="user" size={12} color="#10B981" /> {shipment.destination.contactName}
                  </Text>
                )}
                {shipment.destination.contactPhone && (
                  <Text style={ClientShipmentDetailsStyle.contactInfo}>
                    <FontAwesome name="phone" size={12} color="#10B981" /> {shipment.destination.contactPhone}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Detalles de la Carga */}
        <View style={ClientShipmentDetailsStyle.section}>
          <Text style={ClientShipmentDetailsStyle.sectionTitle}>DETALLES DE LA CARGA</Text>
          <View style={ClientShipmentDetailsStyle.detailsCard}>
            <View style={ClientShipmentDetailsStyle.detailRow}>
              <View style={ClientShipmentDetailsStyle.detailIcon}>
                <FontAwesome name="cube" size={16} color="#10B981" />
              </View>
              <View style={ClientShipmentDetailsStyle.detailContent}>
                <Text style={ClientShipmentDetailsStyle.detailLabel}>Tipo de carga</Text>
                <Text style={ClientShipmentDetailsStyle.detailValue}>{shipment.cargoType}</Text>
              </View>
            </View>
            <View style={ClientShipmentDetailsStyle.detailRow}>
              <View style={ClientShipmentDetailsStyle.detailIcon}>
                <FontAwesome name="align-left" size={16} color="#10B981" />
              </View>
              <View style={ClientShipmentDetailsStyle.detailContent}>
                <Text style={ClientShipmentDetailsStyle.detailLabel}>Descripción</Text>
                <Text style={ClientShipmentDetailsStyle.detailValue}>{shipment.cargoDescription}</Text>
              </View>
            </View>
            <View style={ClientShipmentDetailsStyle.detailRow}>
              <View style={ClientShipmentDetailsStyle.detailIcon}>
                <FontAwesome name="balance-scale" size={16} color="#10B981" />
              </View>
              <View style={ClientShipmentDetailsStyle.detailContent}>
                <Text style={ClientShipmentDetailsStyle.detailLabel}>Peso</Text>
                <Text style={ClientShipmentDetailsStyle.detailValue}>{shipment.weight} kg</Text>
              </View>
            </View>
            <View style={ClientShipmentDetailsStyle.detailRow}>
              <View style={ClientShipmentDetailsStyle.detailIcon}>
                <FontAwesome name="dollar" size={16} color="#10B981" />
              </View>
              <View style={ClientShipmentDetailsStyle.detailContent}>
                <Text style={ClientShipmentDetailsStyle.detailLabel}>Precio</Text>
                <Text style={ClientShipmentDetailsStyle.priceValue}>${shipment.price.toLocaleString()}</Text>
              </View>
            </View>
            <View style={ClientShipmentDetailsStyle.detailRow}>
              <View style={ClientShipmentDetailsStyle.detailIcon}>
                <FontAwesome name="calendar" size={16} color="#10B981" />
              </View>
              <View style={ClientShipmentDetailsStyle.detailContent}>
                <Text style={ClientShipmentDetailsStyle.detailLabel}>Fecha de recogida</Text>
                <Text style={ClientShipmentDetailsStyle.detailValue}>
                  {new Date(shipment.pickupDate).toLocaleDateString('es-MX')}
                </Text>
              </View>
            </View>
            {shipment.notes && (
              <View style={ClientShipmentDetailsStyle.detailRow}>
                <View style={ClientShipmentDetailsStyle.detailIcon}>
                  <FontAwesome name="sticky-note" size={16} color="#10B981" />
                </View>
                <View style={ClientShipmentDetailsStyle.detailContent}>
                  <Text style={ClientShipmentDetailsStyle.detailLabel}>Notas</Text>
                  <Text style={ClientShipmentDetailsStyle.detailValue}>{shipment.notes}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Botón de cancelar (solo si está pendiente) */}
        {shipment.status === ShipmentStatus.PENDING && (
          <View style={ClientShipmentDetailsStyle.section}>
            <TouchableOpacity
              style={ClientShipmentDetailsStyle.cancelButton}
              onPress={handleCancelShipment}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <>
                  <FontAwesome name="times-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                  <Text style={ClientShipmentDetailsStyle.cancelButtonText}>Cancelar Envío</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de Calificación */}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        targetUserName={shipment?.driverName || 'Transportista'}
        userType="driver"
      />
    </SafeAreaView>
  );
};
