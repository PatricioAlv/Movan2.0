import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import TransShipmentDetailsScreenStyles from '@presentation/theme/Trans-Screen-Styles/TransShipmentDetailsScreenStyles';
import { auth } from '@data/config/firebase.config';

const API_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

interface Props {
  navigation: any;
  route: {
    params: {
      shipmentId: string;
    };
  };
}

export const TransShipmentDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
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
      const response = await fetch(`${API_URL}/shipments/${shipmentId}`);
      
      if (!response.ok) {
        throw new Error('No se encontró el pedido');
      }
      
      const data = await response.json();

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

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No hay usuario autenticado');
      return;
    }
    
    const driverId = currentUser.uid;

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
              const response = await fetch(`${API_URL}/shipments/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipmentId, driverId }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'No se pudo aceptar el pedido');
              }

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
      <View style={TransShipmentDetailsScreenStyles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={TransShipmentDetailsScreenStyles.centerContainer}>
        <Text style={TransShipmentDetailsScreenStyles.errorText}>No se encontró el pedido</Text>
      </View>
    );
  }

  const isAvailable = shipment.status === ShipmentStatus.PENDING && !shipment.driverId;

  return (
    <SafeAreaView style={TransShipmentDetailsScreenStyles.container}>

      <ScrollView contentContainerStyle={TransShipmentDetailsScreenStyles.scrollContent}>
        <Card style={TransShipmentDetailsScreenStyles.card}>
          <Text style={TransShipmentDetailsScreenStyles.title}>Detalles del Pedido</Text>
          <Text style={TransShipmentDetailsScreenStyles.shipmentId}>#{shipment.id.slice(0, 8)}</Text>

          <View style={TransShipmentDetailsScreenStyles.statusContainer}>
            <Text style={[
              TransShipmentDetailsScreenStyles.statusBadge,
              isAvailable ? TransShipmentDetailsScreenStyles.statusAvailable : TransShipmentDetailsScreenStyles.statusUnavailable
            ]}>
              {isAvailable ? 'Disponible' : 'No Disponible'}
            </Text>
          </View>
        </Card>

        <Card style={TransShipmentDetailsScreenStyles.card}>
          <Text style={TransShipmentDetailsScreenStyles.sectionTitle}>📍 Ubicaciones</Text>

          <View style={TransShipmentDetailsScreenStyles.locationSection}>
            <Text style={TransShipmentDetailsScreenStyles.locationLabel}>Origen</Text>
            <Text style={TransShipmentDetailsScreenStyles.locationAddress}>{shipment.origin.address}</Text>
            {shipment.origin.contactName && (
              <Text style={TransShipmentDetailsScreenStyles.contactInfo}>
                Contacto: {shipment.origin.contactName}
              </Text>
            )}
            {shipment.origin.contactPhone && (
              <Text style={TransShipmentDetailsScreenStyles.contactInfo}>
                Tel: {shipment.origin.contactPhone}
              </Text>
            )}
          </View>

          <View style={TransShipmentDetailsScreenStyles.divider} />

          <View style={TransShipmentDetailsScreenStyles.locationSection}>
            <Text style={TransShipmentDetailsScreenStyles.locationLabel}>Destino</Text>
            <Text style={TransShipmentDetailsScreenStyles.locationAddress}>{shipment.destination.address}</Text>
            {shipment.destination.contactName && (
              <Text style={TransShipmentDetailsScreenStyles.contactInfo}>
                Contacto: {shipment.destination.contactName}
              </Text>
            )}
            {shipment.destination.contactPhone && (
              <Text style={TransShipmentDetailsScreenStyles.contactInfo}>
                Tel: {shipment.destination.contactPhone}
              </Text>
            )}
          </View>
        </Card>

        <Card style={TransShipmentDetailsScreenStyles.card}>
          <Text style={TransShipmentDetailsScreenStyles.sectionTitle}>📦 Información de la Carga</Text>
          <View style={TransShipmentDetailsScreenStyles.detailRow}>
            <Text style={TransShipmentDetailsScreenStyles.detailLabel}>Tipo de carga:</Text>
            <Text style={TransShipmentDetailsScreenStyles.detailValue}>{shipment.cargoType}</Text>
          </View>

          <View style={TransShipmentDetailsScreenStyles.detailRow}>
            <Text style={TransShipmentDetailsScreenStyles.detailLabel}>Descripción:</Text>
            <Text style={TransShipmentDetailsScreenStyles.detailValue}>{shipment.cargoDescription}</Text>
          </View>

          <View style={TransShipmentDetailsScreenStyles.detailRow}>
            <Text style={TransShipmentDetailsScreenStyles.detailLabel}>Peso:</Text>
            <Text style={TransShipmentDetailsScreenStyles.detailValue}>{shipment.weight} kg</Text>
          </View>

          <View style={TransShipmentDetailsScreenStyles.detailRow}>
            <Text style={TransShipmentDetailsScreenStyles.detailLabel}>Fecha de recogida:</Text>
            <Text style={TransShipmentDetailsScreenStyles.detailValue}>
              {new Date(shipment.pickupDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {shipment.notes && (
            <View style={TransShipmentDetailsScreenStyles.notesContainer}>
              <Text style={TransShipmentDetailsScreenStyles.detailLabel}>Notas:</Text>
              <Text style={TransShipmentDetailsScreenStyles.notesText}>{shipment.notes}</Text>
            </View>
          )}
        </Card>

        <Card style={TransShipmentDetailsScreenStyles.priceCard}>
          <Text style={TransShipmentDetailsScreenStyles.priceLabel}>Precio del servicio</Text>
          <Text style={TransShipmentDetailsScreenStyles.priceValue}>${shipment.price.toLocaleString()}</Text>
        </Card>

        {isAvailable && (
          <Button
            title={accepting ? "Aceptando..." : "Aceptar Pedido"}
            onPress={handleAcceptShipment}
            disabled={accepting}
            style={TransShipmentDetailsScreenStyles.acceptButton}
          />
        )}

        {!isAvailable && (
          <View style={TransShipmentDetailsScreenStyles.unavailableContainer}>
            <Text style={TransShipmentDetailsScreenStyles.unavailableText}>
              Este pedido ya no está disponible
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
