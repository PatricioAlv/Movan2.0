import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { RatingModal } from '@presentation/components/common/RatingModal';
import { useRating } from '@presentation/hooks/useRating';
import { auth } from '@data/config/firebase.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MyShipmentDetailsScreenStyles from '@presentation/theme/Trans-Screen-Styles/MyShipmentDetailsScreenStyles';

const API_BASE_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

interface Props {
  navigation: any;
  route: {
    params: {
      shipmentId: string;
    };
  };
}

export const MyShipmentDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { shipmentId } = route.params;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [clientName, setClientName] = useState<string>('Cliente');

  const { createRating, checkIfUserRated } = useRating();

  useEffect(() => {
    loadShipmentDetails();
  }, [shipmentId]);

  const loadShipmentDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar envío');
      }

      if (data) {
        setShipment(data);
        
        // Obtener información del cliente
        try {
          const userResponse = await fetch(`${API_BASE_URL}/users/${data.clientId}`);
          const client = await userResponse.json();
          if (userResponse.ok && client) {
            setClientName(client.name);
          }
        } catch (error) {
          console.error('Error loading client info:', error);
        }
        
        // Verificar si ya calificó al cliente
        if (data.status === ShipmentStatus.DELIVERED) {
          const rated = await checkIfUserRated(auth.currentUser?.uid || '', data.id);
          setHasRated(rated);
        }
      } else {
        Alert.alert('Error', 'No se encontró el envío');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading shipment:', error);
      Alert.alert('Error', 'No se pudo cargar la información del envío');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (rating: number, comment?: string) => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId || !shipment?.clientId) {
        throw new Error('No se pudo obtener la información necesaria');
      }

      await createRating(currentUserId, {
        shipmentId: shipment.id,
        toUserId: shipment.clientId,
        rating,
        comment,
      });

      Alert.alert('Éxito', 'Tu calificación ha sido enviada');
      setHasRated(true);
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  };

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

  const handleStartTrip = () => {
    navigation.navigate('ActiveShipment', { shipmentId: shipment!.id });
  };

  const handleMarkDelivered = () => {
    Alert.alert(
      'Marcar como Entregado',
      '¿Confirmas que has entregado este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setUpdating(true);
              const userId = auth.currentUser?.uid;

              const response = await fetch(`${API_BASE_URL}/shipments/updateStatus`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  shipmentId,
                  status: ShipmentStatus.DELIVERED,
                  driverId: userId,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'No se pudo actualizar el estado');
              }

              Alert.alert('Éxito', 'Envío marcado como entregado', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo actualizar el estado');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={MyShipmentDetailsScreenStyles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={MyShipmentDetailsScreenStyles.centerContainer}>
        <Text style={MyShipmentDetailsScreenStyles.errorText}>No se encontró el envío</Text>
      </View>
    );
  }

  const getStatusColor = (status: ShipmentStatus): string => {
    switch (status) {
      case ShipmentStatus.ACCEPTED:
        return '#4169E1';
      case ShipmentStatus.IN_TRANSIT:
        return '#9370DB';
      case ShipmentStatus.DELIVERED:
        return '#32CD32';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: ShipmentStatus): string => {
    switch (status) {
      case ShipmentStatus.ACCEPTED:
        return 'Aceptado';
      case ShipmentStatus.IN_TRANSIT:
        return 'En Tránsito';
      case ShipmentStatus.DELIVERED:
        return 'Entregado';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={MyShipmentDetailsScreenStyles.container}>
      <ScrollView contentContainerStyle={MyShipmentDetailsScreenStyles.scrollContent}>
        {/* Header */}
        <View style={MyShipmentDetailsScreenStyles.header}>
          <View>
            <Text style={MyShipmentDetailsScreenStyles.headerLabel}>ID del Envío</Text>
            <Text style={MyShipmentDetailsScreenStyles.shipmentId}>#{shipment.id.slice(0, 8).toUpperCase()}</Text>
          </View>
          <View style={[MyShipmentDetailsScreenStyles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
            <Text style={MyShipmentDetailsScreenStyles.statusText}>{getStatusText(shipment.status)}</Text>
          </View>
        </View>

        {/* Cargo Info */}
        <View style={MyShipmentDetailsScreenStyles.card}>
          <View style={MyShipmentDetailsScreenStyles.cardHeader}>
            <FontAwesome name="cube" size={20} color="#10B981" />
            <Text style={MyShipmentDetailsScreenStyles.cardTitle}>Información de la Carga</Text>
          </View>
          <Text style={MyShipmentDetailsScreenStyles.cargoDescription}>{shipment.cargoDescription}</Text>
          <View style={MyShipmentDetailsScreenStyles.detailsGrid}>
            <View style={MyShipmentDetailsScreenStyles.detailItem}>
              <Text style={MyShipmentDetailsScreenStyles.detailLabel}>Tipo</Text>
              <Text style={MyShipmentDetailsScreenStyles.detailValue}>{shipment.cargoType}</Text>
            </View>
            <View style={MyShipmentDetailsScreenStyles.detailItem}>
              <Text style={MyShipmentDetailsScreenStyles.detailLabel}>Peso</Text>
              <Text style={MyShipmentDetailsScreenStyles.detailValue}>{shipment.weight} kg</Text>
            </View>
          </View>
        </View>

        {/* Origin */}
        <View style={MyShipmentDetailsScreenStyles.card}>
          <View style={MyShipmentDetailsScreenStyles.cardHeader}>
            <FontAwesome name="map-marker" size={20} color="#E74C3C" />
            <Text style={MyShipmentDetailsScreenStyles.cardTitle}>Origen</Text>
          </View>
          <Text style={MyShipmentDetailsScreenStyles.locationAddress}>{shipment.origin.address}</Text>
          {shipment.origin.contactName && (
            <View style={MyShipmentDetailsScreenStyles.contactRow}>
              <FontAwesome name="user" size={14} color="#9CA3AF" />
              <Text style={MyShipmentDetailsScreenStyles.contactText}>{shipment.origin.contactName}</Text>
            </View>
          )}
          {shipment.origin.contactPhone && (
            <TouchableOpacity 
              style={MyShipmentDetailsScreenStyles.contactRow}
              onPress={() => Linking.openURL(`tel:${shipment.origin.contactPhone}`)}
            >
              <FontAwesome name="phone" size={14} color="#10B981" />
              <Text style={[MyShipmentDetailsScreenStyles.contactText, MyShipmentDetailsScreenStyles.phoneLink]}>{shipment.origin.contactPhone}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={MyShipmentDetailsScreenStyles.mapButton}
            onPress={() => openGoogleMaps(
              shipment.origin.latitude,
              shipment.origin.longitude,
              shipment.origin.address
            )}
          >
            <FontAwesome name="map" size={16} color="#FFFFFF" />
            <Text style={MyShipmentDetailsScreenStyles.mapButtonText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Destination */}
        <View style={MyShipmentDetailsScreenStyles.card}>
          <View style={MyShipmentDetailsScreenStyles.cardHeader}>
            <FontAwesome name="map-marker" size={20} color="#27AE60" />
            <Text style={MyShipmentDetailsScreenStyles.cardTitle}>Destino</Text>
          </View>
          <Text style={MyShipmentDetailsScreenStyles.locationAddress}>{shipment.destination.address}</Text>
          {shipment.destination.contactName && (
            <View style={MyShipmentDetailsScreenStyles.contactRow}>
              <FontAwesome name="user" size={14} color="#9CA3AF" />
              <Text style={MyShipmentDetailsScreenStyles.contactText}>{shipment.destination.contactName}</Text>
            </View>
          )}
          {shipment.destination.contactPhone && (
            <TouchableOpacity 
              style={MyShipmentDetailsScreenStyles.contactRow}
              onPress={() => Linking.openURL(`tel:${shipment.destination.contactPhone}`)}
            >
              <FontAwesome name="phone" size={14} color="#10B981" />
              <Text style={[MyShipmentDetailsScreenStyles.contactText, MyShipmentDetailsScreenStyles.phoneLink]}>{shipment.destination.contactPhone}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={MyShipmentDetailsScreenStyles.mapButton}
            onPress={() => openGoogleMaps(
              shipment.destination.latitude,
              shipment.destination.longitude,
              shipment.destination.address
            )}
          >
            <FontAwesome name="map" size={16} color="#FFFFFF" />
            <Text style={MyShipmentDetailsScreenStyles.mapButtonText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Pickup Date & Price */}
        <View style={MyShipmentDetailsScreenStyles.card}>
          <View style={MyShipmentDetailsScreenStyles.infoRow}>
            <View style={MyShipmentDetailsScreenStyles.infoItem}>
              <FontAwesome name="calendar" size={18} color="#9CA3AF" />
              <View style={MyShipmentDetailsScreenStyles.infoContent}>
                <Text style={MyShipmentDetailsScreenStyles.infoLabel}>Fecha de Recogida</Text>
                <Text style={MyShipmentDetailsScreenStyles.infoValue}>
                  {new Date(shipment.pickupDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View style={MyShipmentDetailsScreenStyles.divider} />
          <View style={MyShipmentDetailsScreenStyles.infoRow}>
            <View style={MyShipmentDetailsScreenStyles.infoItem}>
              <FontAwesome name="money" size={18} color="#10B981" />
              <View style={MyShipmentDetailsScreenStyles.infoContent}>
                <Text style={MyShipmentDetailsScreenStyles.infoLabel}>Precio del Servicio</Text>
                <Text style={MyShipmentDetailsScreenStyles.priceValue}>${shipment.price.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes */}
        {shipment.notes && (
          <View style={MyShipmentDetailsScreenStyles.card}>
            <View style={MyShipmentDetailsScreenStyles.cardHeader}>
              <FontAwesome name="sticky-note-o" size={18} color="#9CA3AF" />
              <Text style={MyShipmentDetailsScreenStyles.cardTitle}>Notas</Text>
            </View>
            <Text style={MyShipmentDetailsScreenStyles.notesText}>{shipment.notes}</Text>
          </View>
        )}

        {/* Sección de Calificación (solo si está entregado) */}
        {shipment.status === ShipmentStatus.DELIVERED && (
          <View style={MyShipmentDetailsScreenStyles.card}>
            <View style={MyShipmentDetailsScreenStyles.cardHeader}>
              <FontAwesome name="star" size={18} color="#FFD700" />
              <Text style={MyShipmentDetailsScreenStyles.cardTitle}>Calificar Cliente</Text>
            </View>
            {hasRated ? (
              <View style={MyShipmentDetailsScreenStyles.ratedContainer}>
                <FontAwesome name="check-circle" size={24} color="#10B981" />
                <Text style={MyShipmentDetailsScreenStyles.ratedText}>Ya calificaste a este cliente</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={MyShipmentDetailsScreenStyles.rateButton}
                onPress={() => setShowRatingModal(true)}
              >
                <FontAwesome name="star" size={20} color="#FFFFFF" />
                <Text style={MyShipmentDetailsScreenStyles.rateButtonText}>Calificar Cliente</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={MyShipmentDetailsScreenStyles.actionsContainer}>
          {shipment.status === ShipmentStatus.ACCEPTED && (
            <Button
              title="🗺️ Iniciar Viaje"
              onPress={handleStartTrip}
              style={MyShipmentDetailsScreenStyles.primaryButton}
            />
          )}

          {shipment.status === ShipmentStatus.IN_TRANSIT && (
            <>
              <Button
                title="🗺️ Continuar Navegación"
                onPress={handleStartTrip}
                style={MyShipmentDetailsScreenStyles.primaryButton}
              />
              <Button
                title="✓ Marcar como Entregado"
                onPress={handleMarkDelivered}
                disabled={updating}
                style={MyShipmentDetailsScreenStyles.deliveryButton}
              />
            </>
          )}

          {shipment.status === ShipmentStatus.DELIVERED && (
            <View style={MyShipmentDetailsScreenStyles.completedContainer}>
              <FontAwesome name="check-circle" size={48} color="#10B981" />
              <Text style={MyShipmentDetailsScreenStyles.completedText}>Envío Completado</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Calificación */}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        targetUserName={clientName}
        userType="client"
      />
    </SafeAreaView>
  );
};
