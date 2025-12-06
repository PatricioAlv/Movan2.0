import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking, Platform } from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { User } from '@core/entities/User';
import { API_ENDPOINTS } from '@infrastructure/utils/constants';
import { auth } from '@data/config/firebase.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TransShipmentDetailsScreenStyles from '@presentation/theme/Trans-Screen-Styles/TransShipmentDetailsScreenStyles';

const API_BASE_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

interface Props {
  route: any;
  navigation: any;
}

export const TransShipmentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { shipmentId } = route.params;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [clientData, setClientData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  const loadShipmentDetails = async () => {
    try {
      // GET /shipments/:shipmentId
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_SHIPMENT_BY_ID}/${shipmentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar los detalles');
      }

      setShipment(data);
      
      // Cargar datos del cliente si tenemos clientId
      if (data?.clientId) {
        try {
          const clientResponse = await fetch(`${API_BASE_URL}/users/${data.clientId}`);
          if (clientResponse.ok) {
            const clientInfo = await clientResponse.json();
            setClientData(clientInfo);
          }
        } catch (e) {
          console.log('No se pudieron cargar datos del cliente');
        }
      }
    } catch (error: any) {
      console.error('Error loading shipment details:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar los detalles del pedido');
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
              
              const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ACCEPT_SHIPMENT}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipmentId, driverId: userId }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Error al aceptar el pedido');
              }

              Alert.alert('Éxito', 'Pedido aceptado correctamente', [
                {
                  text: 'OK',
                  onPress: () => {
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
      <View style={TransShipmentDetailsScreenStyles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={TransShipmentDetailsScreenStyles.centerContainer}>
        <Text style={TransShipmentDetailsScreenStyles.errorText}>No se encontró el pedido</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const canAccept = shipment.status === ShipmentStatus.PENDING && !shipment.driverId;

  return (
    <View style={TransShipmentDetailsScreenStyles.container}>
      <ScrollView style={TransShipmentDetailsScreenStyles.scrollContainer} contentContainerStyle={TransShipmentDetailsScreenStyles.scrollContent}>
        {/* Map Placeholder */}
        <View style={TransShipmentDetailsScreenStyles.mapCard}>
          <TouchableOpacity
            style={TransShipmentDetailsScreenStyles.mapPlaceholder}
            onPress={() => openGoogleMaps(
              shipment.origin.latitude,
              shipment.origin.longitude,
              shipment.origin.address
            )}
          >
            <FontAwesome name="map" size={40} color="#4B5563" />
            <Text style={TransShipmentDetailsScreenStyles.mapPlaceholderText}>Ver Ruta en Mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Price Card */}
        <View style={TransShipmentDetailsScreenStyles.card}>
          <Text style={TransShipmentDetailsScreenStyles.priceText}>${shipment.price.toLocaleString('es-ES')}</Text>
        </View>

        {/* Points Section */}
        <Text style={TransShipmentDetailsScreenStyles.sectionTitle}>Puntos de Recogida y Entrega</Text>
        <View style={TransShipmentDetailsScreenStyles.card}>
          {/* Origin */}
          <View style={TransShipmentDetailsScreenStyles.pointRow}>
            <View style={TransShipmentDetailsScreenStyles.iconContainer}>
              <FontAwesome name="arrow-up" size={14} color="#10B981" />
            </View>
            <View style={TransShipmentDetailsScreenStyles.pointDetails}>
              <Text style={TransShipmentDetailsScreenStyles.pointAddress} numberOfLines={2}>{shipment.origin.address}</Text>
              <Text style={TransShipmentDetailsScreenStyles.pointDate}>
                {new Date(shipment.pickupDate).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </Text>
            </View>
          </View>

          <View style={TransShipmentDetailsScreenStyles.divider} />

          {/* Destination */}
          <View style={TransShipmentDetailsScreenStyles.pointRow}>
            <View style={TransShipmentDetailsScreenStyles.iconContainer}>
              <FontAwesome name="arrow-down" size={14} color="#10B981" />
            </View>
            <View style={TransShipmentDetailsScreenStyles.pointDetails}>
              <Text style={TransShipmentDetailsScreenStyles.pointAddress} numberOfLines={2}>{shipment.destination.address}</Text>
              <Text style={TransShipmentDetailsScreenStyles.pointDate}>
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
        <Text style={TransShipmentDetailsScreenStyles.sectionTitle}>Detalles de la Carga</Text>
        <View style={TransShipmentDetailsScreenStyles.card}>
          <View style={TransShipmentDetailsScreenStyles.detailItem}>
            <FontAwesome name="cube" size={16} color="#10B981" style={TransShipmentDetailsScreenStyles.detailIcon} />
            <Text style={TransShipmentDetailsScreenStyles.detailText}>{shipment.cargoType}</Text>
          </View>
          <View style={TransShipmentDetailsScreenStyles.detailItem}>
            <FontAwesome name="balance-scale" size={16} color="#10B981" style={TransShipmentDetailsScreenStyles.detailIcon} />
            <Text style={TransShipmentDetailsScreenStyles.detailText}>{shipment.weight} kg</Text>
          </View>
          <View style={TransShipmentDetailsScreenStyles.detailItem}>
            <FontAwesome name="arrows-alt" size={16} color="#10B981" style={TransShipmentDetailsScreenStyles.detailIcon} />
            <Text style={TransShipmentDetailsScreenStyles.detailText}>4.5m x 2.5m x 3.0m</Text>
          </View>
        </View>

        {/* Client Info */}
        <Text style={TransShipmentDetailsScreenStyles.sectionTitle}>Información del Cliente</Text>
        <View style={TransShipmentDetailsScreenStyles.card}>
          <View style={TransShipmentDetailsScreenStyles.clientRow}>
            <View style={TransShipmentDetailsScreenStyles.clientInfo}>
              <Text style={TransShipmentDetailsScreenStyles.clientName}>
                {clientData?.name || shipment.origin.contactName || 'Cliente'}
              </Text>
              {clientData && (
                <View style={TransShipmentDetailsScreenStyles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = clientData.averageRating || 0;
                    const filled = star <= Math.floor(rating);
                    const half = !filled && star <= Math.ceil(rating);
                    return (
                      <FontAwesome
                        key={star}
                        name={filled ? 'star' : half ? 'star-half-full' : 'star-o'}
                        size={12}
                        color="#FBBF24"
                      />
                    );
                  })}
                  <Text style={TransShipmentDetailsScreenStyles.ratingText}>({clientData.averageRating?.toFixed(1) || '0.0'})</Text>
                </View>
              )}
            </View>
            {shipment.origin.contactPhone && (
              <TouchableOpacity
                style={TransShipmentDetailsScreenStyles.phoneButton}
                onPress={() => Linking.openURL(`tel:${shipment.origin.contactPhone}`)}
              >
                <FontAwesome name="phone" size={18} color="#10B981" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={TransShipmentDetailsScreenStyles.bottomBar}>
        <TouchableOpacity style={TransShipmentDetailsScreenStyles.rejectButton} onPress={() => navigation.goBack()}>
          <Text style={TransShipmentDetailsScreenStyles.rejectButtonText}>Rechazar</Text>
        </TouchableOpacity>

        {canAccept ? (
          <TouchableOpacity
            style={[TransShipmentDetailsScreenStyles.acceptButton, accepting && TransShipmentDetailsScreenStyles.disabledButton]}
            onPress={handleAcceptShipment}
            disabled={accepting}
          >
            {accepting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={TransShipmentDetailsScreenStyles.acceptButtonText}>Aceptar Carga</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={[TransShipmentDetailsScreenStyles.acceptButton, TransShipmentDetailsScreenStyles.disabledButton]}>
            <Text style={TransShipmentDetailsScreenStyles.acceptButtonText}>No Disponible</Text>
          </View>
        )}
      </View>
    </View>
  );
};