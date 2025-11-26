import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { GetShipmentByIdUseCase } from '@core/usecases/shipments/GetShipmentByIdUseCase';
import { AcceptShipmentUseCase } from '@core/usecases/shipments/AcceptShipmentUseCase';
import { styles } from '@presentation/theme/Trans-Screen-Styles/TransportistShipmentDetailsStyle';

interface Props {
  navigation: any;
  route: {
    params: {
      shipmentId: string;
    };
  };
}

export const TransportistShipmentDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { shipmentId } = route.params;
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    loadShipmentDetails();
  }, [shipmentId]);

  const loadShipmentDetails = async () => {
    try {
      setLoading(true);
      const getShipmentByIdUseCase = container.get<GetShipmentByIdUseCase>(
        TYPES.GetShipmentByIdUseCase
      );
      const data = await getShipmentByIdUseCase.execute(shipmentId);

      if (data) {
        setShipment(data);
      } else {
        Alert.alert('Error', 'No se encontró el pedido');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading shipment:', error);
      Alert.alert('Error', 'No se pudo cargar la información del pedido');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptShipment = async () => {
    if (!shipment) return;

    // TODO: Obtener el ID del transportista del usuario autenticado
    // Por ahora usamos un ID temporal
    const driverId = 'temp-driver-id';

    Alert.alert(
      'Confirmar',
      '¿Deseas aceptar este pedido?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              setAccepting(true);
              const acceptShipmentUseCase = container.get<AcceptShipmentUseCase>(
                TYPES.AcceptShipmentUseCase
              );
              await acceptShipmentUseCase.execute(shipmentId, driverId);

              Alert.alert('Éxito', 'Has aceptado el pedido exitosamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('TransportistHome'),
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
      </View>
    );
  }

  const isAvailable = shipment.status === ShipmentStatus.PENDING && !shipment.driverId;

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.title}>Detalles del Pedido</Text>
          <Text style={styles.shipmentId}>#{shipment.id.slice(0, 8)}</Text>

          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusBadge,
              isAvailable ? styles.statusAvailable : styles.statusUnavailable
            ]}>
              {isAvailable ? 'Disponible' : 'No Disponible'}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>📍 Ubicaciones</Text>

          <View style={styles.locationSection}>
            <Text style={styles.locationLabel}>Origen</Text>
            <Text style={styles.locationAddress}>{shipment.origin.address}</Text>
            {shipment.origin.contactName && (
              <Text style={styles.contactInfo}>
                Contacto: {shipment.origin.contactName}
              </Text>
            )}
            {shipment.origin.contactPhone && (
              <Text style={styles.contactInfo}>
                Tel: {shipment.origin.contactPhone}
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.locationSection}>
            <Text style={styles.locationLabel}>Destino</Text>
            <Text style={styles.locationAddress}>{shipment.destination.address}</Text>
            {shipment.destination.contactName && (
              <Text style={styles.contactInfo}>
                Contacto: {shipment.destination.contactName}
              </Text>
            )}
            {shipment.destination.contactPhone && (
              <Text style={styles.contactInfo}>
                Tel: {shipment.destination.contactPhone}
              </Text>
            )}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>📦 Información de la Carga</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tipo de carga:</Text>
            <Text style={styles.detailValue}>{shipment.cargoType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Descripción:</Text>
            <Text style={styles.detailValue}>{shipment.cargoDescription}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Peso:</Text>
            <Text style={styles.detailValue}>{shipment.weight} kg</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de recogida:</Text>
            <Text style={styles.detailValue}>
              {new Date(shipment.pickupDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {shipment.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.detailLabel}>Notas:</Text>
              <Text style={styles.notesText}>{shipment.notes}</Text>
            </View>
          )}
        </Card>

        <Card style={styles.priceCard}>
          <Text style={styles.priceLabel}>Precio del servicio</Text>
          <Text style={styles.priceValue}>${shipment.price.toLocaleString()}</Text>
        </Card>

        {isAvailable && (
          <Button
            title={accepting ? "Aceptando..." : "Aceptar Pedido"}
            onPress={handleAcceptShipment}
            disabled={accepting}
            style={styles.acceptButton}
          />
        )}

        {!isAvailable && (
          <View style={styles.unavailableContainer}>
            <Text style={styles.unavailableText}>
              Este pedido ya no está disponible
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
