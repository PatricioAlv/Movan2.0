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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Sección de Origen */}
        <View style={styles.locationSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📍</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Origen</Text>
            <Text style={styles.locationAddress}>{shipment.origin.address}</Text>
            {shipment.origin.contactName && (
              <Text style={styles.contactText}>Contacto: {shipment.origin.contactName}</Text>
            )}
            {shipment.origin.contactPhone && (
              <Text style={styles.contactText}>Tel: {shipment.origin.contactPhone}</Text>
            )}
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => openGoogleMaps(
                shipment.origin.latitude,
                shipment.origin.longitude,
                shipment.origin.address
              )}
            >
              <FontAwesome name="map-marker" size={16} color="#FFFFFF" />
              <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Línea divisoria */}
        <View style={styles.divider} />

        {/* Sección de Destino */}
        <View style={styles.locationSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📍</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Destino</Text>
            <Text style={styles.locationAddress}>{shipment.destination.address}</Text>
            {shipment.destination.contactName && (
              <Text style={styles.contactText}>Contacto: {shipment.destination.contactName}</Text>
            )}
            {shipment.destination.contactPhone && (
              <Text style={styles.contactText}>Tel: {shipment.destination.contactPhone}</Text>
            )}
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => openGoogleMaps(
                shipment.destination.latitude,
                shipment.destination.longitude,
                shipment.destination.address
              )}
            >
              <FontAwesome name="map-marker" size={16} color="#FFFFFF" />
              <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Línea divisoria */}
        <View style={styles.divider} />

        {/* Información de Carga */}
        <View style={styles.cargoSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📦</Text>
          </View>
          <View style={styles.cargoInfo}>
            <Text style={styles.cargoLabel}>Tipo:</Text>
            <Text style={styles.cargoLabel}>Descripción:</Text>
            <Text style={styles.cargoLabel}>Peso:</Text>
          </View>
          <View style={styles.cargoValues}>
            <Text style={styles.cargoValue}>{shipment.cargoType}</Text>
            <Text style={styles.cargoValue}>{shipment.cargoDescription}</Text>
            <Text style={styles.cargoValue}>{shipment.weight} kg</Text>
          </View>
        </View>

        {/* Línea divisoria */}
        <View style={styles.divider} />

        {/* Fecha de Recogida */}
        <View style={styles.dateSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Recogida:</Text>
            <Text style={styles.dateValue}>
              {new Date(shipment.pickupDate).toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>

        {/* Línea divisoria */}
        <View style={styles.divider} />

        {/* Precio */}
        <View style={styles.priceSection}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>💰</Text>
          </View>
          <Text style={styles.price}>${shipment.price.toLocaleString('es-ES')}</Text>
        </View>

        {/* Botón de Aceptar o Mensaje */}
        {canAccept ? (
          <Button
            title={accepting ? 'Aceptando...' : 'Aceptar Pedido'}
            onPress={handleAcceptShipment}
            disabled={accepting}
            style={styles.acceptButton}
          />
        ) : (
          <View style={styles.notAvailableContainer}>
            <Text style={styles.notAvailableText}>
              {shipment.driverId ? 'Este pedido ya fue aceptado' : 'Este pedido ya no está disponible'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  content: {
    backgroundColor: colors.white,
    margin: spacing.md,
    borderRadius: 12,
    padding: spacing.lg,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.gray600,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  contactText: {
    fontSize: 13,
    color: colors.gray600,
    marginTop: 2,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.md,
  },
  cargoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cargoInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  cargoLabel: {
    fontSize: 13,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  cargoValues: {
    flex: 1,
  },
  cargoValue: {
    fontSize: 13,
    color: '#000',
    marginBottom: spacing.xs,
    textAlign: 'right',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  dateLabel: {
    fontSize: 13,
    color: colors.gray600,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    color: '#000',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  acceptButton: {
    marginTop: spacing.md,
  },
  notAvailableContainer: {
    backgroundColor: '#FFF3CD',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  notAvailableText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});
