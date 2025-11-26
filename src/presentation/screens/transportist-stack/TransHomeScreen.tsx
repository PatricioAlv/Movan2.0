import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import TransHomeScreenStyle from '@presentation/theme/Trans-Screen-Styles/TransHomeScreen';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { GetDriverShipmentsUseCase } from '@core/usecases/shipments/GetDriverShipmentsUseCase';
import { UpdateShipmentStatusUseCase } from '@core/usecases/shipments/UpdateShipmentStatusUseCase';
import { useFocusEffect } from '@react-navigation/native';

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
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

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

      const getShipmentsUseCase = container.get<GetDriverShipmentsUseCase>(
        TYPES.GetDriverShipmentsUseCase
      );

      const assignedShipments = await getShipmentsUseCase.execute(userId);
      setShipments(assignedShipments);

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

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadTransportistShipments();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransportistShipments();
  };

  // ============================
  // FILTRADO DE ENVÍOS
  // ============================
  const currentShipments = shipments.filter(
    s => s.status === ShipmentStatus.ACCEPTED || s.status === ShipmentStatus.IN_TRANSIT
  );

  const historyShipments = shipments.filter(
    s => s.status === ShipmentStatus.DELIVERED || s.status === ShipmentStatus.CANCELLED
  );

  const displayedShipments = activeTab === 'current' ? currentShipments : historyShipments;

  // ============================
  // NAVEGACIÓN A DETALLES DEL ENVÍO
  // ============================
  const handleShipmentPress = (shipmentId: string) => {
    navigation.navigate('MyShipmentDetails', { shipmentId });
  };

  // ============================
  // ITEM DEL LISTADO
  // ============================
  
  const renderShipmentItem = ({ item }: { item: Shipment }) => (
    <TouchableOpacity 
      onPress={() => handleShipmentPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={TransHomeScreenStyle.card}>
        {/* Header con ID y Status Badge */}
        <View style={TransHomeScreenStyle.cardHeader}>
          <View>
            <Text style={TransHomeScreenStyle.shipmentId}>ID: #{item.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={TransHomeScreenStyle.cargoType}>{item.cargoDescription}</Text>
          </View>
          <View style={[TransHomeScreenStyle.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={TransHomeScreenStyle.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        {/* Ruta: Origen -> Destino */}
        <View style={TransHomeScreenStyle.routeContainer}>
          <View style={TransHomeScreenStyle.locationPoint}>
            <Text style={TransHomeScreenStyle.locationIcon}>📍</Text>
            <Text style={TransHomeScreenStyle.locationCity}>
              {item.origin.address.split(',')[0]}
            </Text>
          </View>
          <Text style={TransHomeScreenStyle.routeArrow}>→</Text>
          <View style={TransHomeScreenStyle.locationPoint}>
            <Text style={TransHomeScreenStyle.locationIcon}>📍</Text>
            <Text style={TransHomeScreenStyle.locationCity}>
              {item.destination.address.split(',')[0]}
            </Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={TransHomeScreenStyle.dateContainer}>
          <Text style={TransHomeScreenStyle.dateIcon}>📅</Text>
          <Text style={TransHomeScreenStyle.dateText}>
            {new Date(item.pickupDate).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
        <Text style={TransHomeScreenStyle.title}>Mis Envíos</Text>
        <View style={TransHomeScreenStyle.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('current')}>
            <Text style={activeTab === 'current' ? TransHomeScreenStyle.tabActive : TransHomeScreenStyle.tabInactive}>
              En Curso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('history')}>
            <Text style={activeTab === 'history' ? TransHomeScreenStyle.tabActive : TransHomeScreenStyle.tabInactive}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {displayedShipments.length === 0 ? (
        <View style={TransHomeScreenStyle.emptyContainer}>
          <Text style={TransHomeScreenStyle.emptyText}>🚚</Text>
          <Text style={TransHomeScreenStyle.emptyTitle}>
            {activeTab === 'current' ? 'No tienes envíos en curso' : 'No hay envíos en el historial'}
          </Text>
          <Text style={TransHomeScreenStyle.emptySubtext}>
            {activeTab === 'current' 
              ? 'Cuando aceptes un envío, aparecerá aquí' 
              : 'Los envíos completados o cancelados aparecerán aquí'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedShipments}
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
