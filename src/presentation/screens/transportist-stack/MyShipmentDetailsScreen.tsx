import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { RatingModal } from '@presentation/components/common/RatingModal';
import { UserRatingDisplay } from '@presentation/components/common/UserRatingDisplay';
import { useRating } from '@presentation/hooks/useRating';
import { auth } from '@data/config/firebase.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>ID del Envío</Text>
            <Text style={styles.shipmentId}>#{shipment.id.slice(0, 8).toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(shipment.status)}</Text>
          </View>
        </View>

        {/* Cargo Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome name="cube" size={20} color="#10B981" />
            <Text style={styles.cardTitle}>Información de la Carga</Text>
          </View>
          <Text style={styles.cargoDescription}>{shipment.cargoDescription}</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tipo</Text>
              <Text style={styles.detailValue}>{shipment.cargoType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Peso</Text>
              <Text style={styles.detailValue}>{shipment.weight} kg</Text>
            </View>
          </View>
        </View>

        {/* Origin */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome name="map-marker" size={20} color="#E74C3C" />
            <Text style={styles.cardTitle}>Origen</Text>
          </View>
          <Text style={styles.locationAddress}>{shipment.origin.address}</Text>
          {shipment.origin.contactName && (
            <View style={styles.contactRow}>
              <FontAwesome name="user" size={14} color="#9CA3AF" />
              <Text style={styles.contactText}>{shipment.origin.contactName}</Text>
            </View>
          )}
          {shipment.origin.contactPhone && (
            <TouchableOpacity 
              style={styles.contactRow}
              onPress={() => Linking.openURL(`tel:${shipment.origin.contactPhone}`)}
            >
              <FontAwesome name="phone" size={14} color="#10B981" />
              <Text style={[styles.contactText, styles.phoneLink]}>{shipment.origin.contactPhone}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => openGoogleMaps(
              shipment.origin.latitude,
              shipment.origin.longitude,
              shipment.origin.address
            )}
          >
            <FontAwesome name="map" size={16} color="#FFFFFF" />
            <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Destination */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome name="map-marker" size={20} color="#27AE60" />
            <Text style={styles.cardTitle}>Destino</Text>
          </View>
          <Text style={styles.locationAddress}>{shipment.destination.address}</Text>
          {shipment.destination.contactName && (
            <View style={styles.contactRow}>
              <FontAwesome name="user" size={14} color="#9CA3AF" />
              <Text style={styles.contactText}>{shipment.destination.contactName}</Text>
            </View>
          )}
          {shipment.destination.contactPhone && (
            <TouchableOpacity 
              style={styles.contactRow}
              onPress={() => Linking.openURL(`tel:${shipment.destination.contactPhone}`)}
            >
              <FontAwesome name="phone" size={14} color="#10B981" />
              <Text style={[styles.contactText, styles.phoneLink]}>{shipment.destination.contactPhone}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => openGoogleMaps(
              shipment.destination.latitude,
              shipment.destination.longitude,
              shipment.destination.address
            )}
          >
            <FontAwesome name="map" size={16} color="#FFFFFF" />
            <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Pickup Date & Price */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <FontAwesome name="calendar" size={18} color="#9CA3AF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Fecha de Recogida</Text>
                <Text style={styles.infoValue}>
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
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <FontAwesome name="money" size={18} color="#10B981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Precio del Servicio</Text>
                <Text style={styles.priceValue}>${shipment.price.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes */}
        {shipment.notes && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome name="sticky-note-o" size={18} color="#9CA3AF" />
              <Text style={styles.cardTitle}>Notas</Text>
            </View>
            <Text style={styles.notesText}>{shipment.notes}</Text>
          </View>
        )}

        {/* Sección de Calificación (solo si está entregado) */}
        {shipment.status === ShipmentStatus.DELIVERED && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome name="star" size={18} color="#FFD700" />
              <Text style={styles.cardTitle}>Calificar Cliente</Text>
            </View>
            {hasRated ? (
              <View style={styles.ratedContainer}>
                <FontAwesome name="check-circle" size={24} color="#10B981" />
                <Text style={styles.ratedText}>Ya calificaste a este cliente</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => setShowRatingModal(true)}
              >
                <FontAwesome name="star" size={20} color="#FFFFFF" />
                <Text style={styles.rateButtonText}>Calificar Cliente</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {shipment.status === ShipmentStatus.ACCEPTED && (
            <Button
              title="🗺️ Iniciar Viaje"
              onPress={handleStartTrip}
              style={styles.primaryButton}
            />
          )}

          {shipment.status === ShipmentStatus.IN_TRANSIT && (
            <>
              <Button
                title="🗺️ Continuar Navegación"
                onPress={handleStartTrip}
                style={styles.primaryButton}
              />
              <Button
                title="✓ Marcar como Entregado"
                onPress={handleMarkDelivered}
                disabled={updating}
                style={styles.deliveryButton}
              />
            </>
          )}

          {shipment.status === ShipmentStatus.DELIVERED && (
            <View style={styles.completedContainer}>
              <FontAwesome name="check-circle" size={48} color="#10B981" />
              <Text style={styles.completedText}>Envío Completado</Text>
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
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  headerLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  shipmentId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1A1D21',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#2A2D32',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
  cargoDescription: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  contactText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: spacing.xs,
  },
  phoneLink: {
    color: '#10B981',
    textDecorationLine: 'underline',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: spacing.md,
    justifyContent: 'center',
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  infoRow: {
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 20,
    color: '#10B981',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2D32',
    marginVertical: spacing.md,
  },
  notesText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  primaryButton: {
    marginBottom: spacing.sm,
  },
  deliveryButton: {
    backgroundColor: '#10B981',
  },
  completedContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  completedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  rateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  ratedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  ratedText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
