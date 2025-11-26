import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert, } from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import TransHomeScreenStyle from '@presentation/theme/Trans-Screen-Styles/TransHomeScreen';

// (Opcional) importar tus casos de uso reales
// import { GetTransportistShipmentsUseCase } from '@core/usecases/shipments/GetTransportistShipmentsUseCase';
// import { UpdateShipmentStatusUseCase } from '@core/usecases/shipments/UpdateShipmentStatusUseCase';

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
      return colors.textSecondary;
  }
};

const getStatusText = (status: ShipmentStatus): string => {
  switch (status) {
    case ShipmentStatus.PENDING:
      return 'Pendiente';
    case ShipmentStatus.ACCEPTED:
      return 'Aceptado';
    case ShipmentStatus.IN_TRANSIT:
      return 'En Tránsito';
    case ShipmentStatus.DELIVERED:     
      return 'Entregado';
    case ShipmentStatus.CANCELLED:
      return 'Cancelado';
    default:
      return status;
  }
};

interface TransHomeProps {
  navigation: any;
}

export const TransHomeScreen: React.FC<TransHomeProps> = ({ navigation }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ============================
  // CARGA DE ENVÍOS DEL TRANSPORTISTA
  // ============================
  const loadTransportistShipments = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'No se pudo obtener el usuario actual');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Instanciar caso de uso real cuando exista
      // const getShipmentsUseCase = container.get<GetTransportistShipmentsUseCase>(
      //   TYPES.GetTransportistShipmentsUseCase
      // );

      // const assignedShipments = await getShipmentsUseCase.execute(userId);
      // setShipments(assignedShipments);

      // TEMPORAL: lista vacía hasta que lo conectes
      setShipments([]);

    } catch (error: any) {
      console.error('Error loading shipments:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar los envíos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransportistShipments();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransportistShipments();
  };

  // ============================
  // ACCIÓN SOBRE UN ENVÍO
  // (Aceptar, Iniciar, Finalizar, etc.)
  // ============================
  const handleAction = async (shipmentId: string, nextStatus: ShipmentStatus) => {
    try {
      Alert.alert(
        'Actualizar Estado',
        `¿Confirmas cambiar el estado del envío a ${getStatusText(nextStatus)}?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Sí',
            style: 'destructive',
            onPress: async () => {
              // const updateUseCase = container.get<UpdateShipmentStatusUseCase>(
              //   TYPES.UpdateShipmentStatusUseCase
              // );
              // await updateUseCase.execute(shipmentId, nextStatus);

              Alert.alert('Éxito', 'Estado actualizado correctamente');
              loadTransportistShipments();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error updating shipment:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el envío');
    }
  };

  // ============================
  // ITEM DEL LISTADO
  // ============================
  
  const renderShipmentItem = ({ item }: { item: Shipment }) => (
    <Card style={TransHomeScreenStyle.card}>
      <View style={TransHomeScreenStyle.cardHeader}>
        <Text style={TransHomeScreenStyle.shipmentId}>Envío #{item.id.slice(0, 8)}</Text>
        <View style={[TransHomeScreenStyle.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={TransHomeScreenStyle.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={TransHomeScreenStyle.locationLabel}>Origen:</Text>
      <Text style={TransHomeScreenStyle.locationAddress}>{item.origin.address}</Text>

      <Text style={TransHomeScreenStyle.locationLabel}>Destino:</Text>
      <Text style={TransHomeScreenStyle.locationAddress}>{item.destination.address}</Text>

      <View style={TransHomeScreenStyle.actionsContainer}>
        {item.status === ShipmentStatus.PENDING && (
          <Button title="Aceptar" onPress={() => handleAction(item.id, ShipmentStatus.ACCEPTED)} />
        )}

        {item.status === ShipmentStatus.ACCEPTED && (
          <Button title="Iniciar Viaje" onPress={() => handleAction(item.id, ShipmentStatus.IN_TRANSIT)} />
        )}

        {item.status === ShipmentStatus.IN_TRANSIT && (
          <Button title="Marcar Entregado" onPress={() => handleAction(item.id, ShipmentStatus.DELIVERED)} />
        )}
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={TransHomeScreenStyle.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={TransHomeScreenStyle.container}>
      <View style={TransHomeScreenStyle.header}>
        <Text style={TransHomeScreenStyle.title}>Envíos Asignados</Text>
        <Text style={TransHomeScreenStyle.subtitle}>
          {shipments.length} {shipments.length === 1 ? 'envío' : 'envíos'}
        </Text>
      </View>

      {shipments.length === 0 ? (
        <View style={TransHomeScreenStyle.emptyContainer}>
          <Text style={TransHomeScreenStyle.emptyText}>🚚</Text>
          <Text style={TransHomeScreenStyle.emptyTitle}>No tienes envíos asignados</Text>
          <Text style={TransHomeScreenStyle.emptySubtext}>Cuando te asignen uno, aparecerá aquí</Text>
        </View>
      ) : (
        <FlatList
          data={shipments}
          keyExtractor={(item) => item.id}
          renderItem={renderShipmentItem}
          contentContainerStyle={TransHomeScreenStyle.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
};
