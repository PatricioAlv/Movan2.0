import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert} from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { container } from '@infrastructure/di/init';
import { TYPES } from '@infrastructure/di/types';
import { GetClientShipmentsUseCase } from '@core/usecases/shipments/GetClientShipmentsUseCase';
import { CancelShipmentUseCase } from '@core/usecases/shipments/CancelShipmentUseCase';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import ClientHomeScreenStyle from '@presentation/theme/Client-Screen-Styles/ClientHomeScreenStyle';

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

interface ClientHomeScreenProps {
  navigation: any;
}

export const ClientHomeScreen: React.FC<ClientHomeScreenProps> = ({ navigation }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const loadShipments = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'No se pudo obtener el usuario actual');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const getClientShipmentsUseCase = container.get<GetClientShipmentsUseCase>(
        TYPES.GetClientShipmentsUseCase
      );

      const userShipments = await getClientShipmentsUseCase.execute(userId);
      setShipments(userShipments);
    } catch (error: any) {
      console.error('Error loading shipments:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar los envíos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadShipments();
  };

  const getFilteredShipments = () => {
    let filtered = shipments;

    // Filtrar por tab
    if (activeTab === 'active') {
      filtered = filtered.filter(s => 
        s.status !== ShipmentStatus.DELIVERED && 
        s.status !== ShipmentStatus.CANCELLED
      );
    } else {
      filtered = filtered.filter(s => 
        s.status === ShipmentStatus.DELIVERED || 
        s.status === ShipmentStatus.CANCELLED
      );
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cargoType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleCancelShipment = async (shipmentId: string) => {
    Alert.alert(
      'Cancelar Envío',
      '¿Estás seguro de que deseas cancelar este envío?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const cancelShipmentUseCase = container.get<CancelShipmentUseCase>(
                TYPES.CancelShipmentUseCase
              );
              await cancelShipmentUseCase.execute(shipmentId);
              Alert.alert('Éxito', 'Envío cancelado correctamente');
              loadShipments();
            } catch (error: any) {
              console.error('Error canceling shipment:', error);
              Alert.alert('Error', error.message || 'No se pudo cancelar el envío');
            }
          },
        },
      ]
    );
  };

  const renderShipmentItem = ({ item }: { item: Shipment }) => (
    <View style={ClientHomeScreenStyle.card}>
      <View style={ClientHomeScreenStyle.cardHeader}>
        <View>
          <Text style={ClientHomeScreenStyle.shipmentId}>ID: #{item.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={ClientHomeScreenStyle.cargoType}>{item.cargoType}</Text>
        </View>
        <View style={[ClientHomeScreenStyle.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={ClientHomeScreenStyle.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={ClientHomeScreenStyle.routeContainer}>
        <View style={ClientHomeScreenStyle.locationPoint}>
          <Text style={ClientHomeScreenStyle.locationIcon}>🟢</Text>
          <Text style={ClientHomeScreenStyle.locationCity} numberOfLines={1}>
            {item.origin.address.split(',')[0]}
          </Text>
        </View>
        <Text style={ClientHomeScreenStyle.routeArrow}>→</Text>
        <View style={ClientHomeScreenStyle.locationPoint}>
          <Text style={ClientHomeScreenStyle.locationIcon}>🔴</Text>
          <Text style={ClientHomeScreenStyle.locationCity} numberOfLines={1}>
            {item.destination.address.split(',')[0]}
          </Text>
        </View>
      </View>

      <View style={ClientHomeScreenStyle.infoRow}>
        <View style={ClientHomeScreenStyle.infoItem}>
          <Text style={ClientHomeScreenStyle.infoLabel}>📦 Peso</Text>
          <Text style={ClientHomeScreenStyle.infoValue}>{item.weight} kg</Text>
        </View>
        <View style={ClientHomeScreenStyle.infoItem}>
          <Text style={ClientHomeScreenStyle.infoLabel}>💰 Precio</Text>
          <Text style={ClientHomeScreenStyle.priceValue}>${item.price.toLocaleString()}</Text>
        </View>
      </View>

      {item.status === ShipmentStatus.PENDING && (
        <TouchableOpacity
          style={ClientHomeScreenStyle.cancelButton}
          onPress={() => handleCancelShipment(item.id)}
        >
          <Text style={ClientHomeScreenStyle.cancelButtonText}>✕ Cancelar Envío</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={ClientHomeScreenStyle.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const filteredShipments = getFilteredShipments();

  return (
    <SafeAreaView style={ClientHomeScreenStyle.container}>
      <View style={ClientHomeScreenStyle.header}>
        <Text style={ClientHomeScreenStyle.title}>Mis Envíos</Text>
        <View style={ClientHomeScreenStyle.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('active')}>
            <Text style={activeTab === 'active' ? ClientHomeScreenStyle.tabActive : ClientHomeScreenStyle.tabInactive}>
              En Curso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('history')}>
            <Text style={activeTab === 'history' ? ClientHomeScreenStyle.tabActive : ClientHomeScreenStyle.tabInactive}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredShipments.length === 0 ? (
        <View style={ClientHomeScreenStyle.emptyContainer}>
          <Text style={ClientHomeScreenStyle.emptyText}>📦</Text>
          <Text style={ClientHomeScreenStyle.emptyTitle}>
            {activeTab === 'active' ? 'No tienes envíos activos' : 'No hay historial'}
          </Text>
          <Text style={ClientHomeScreenStyle.emptySubtext}>
            {activeTab === 'active' 
              ? 'Crea tu primer envío para comenzar'
              : 'Tus envíos completados aparecerán aquí'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredShipments}
          keyExtractor={(item) => item.id}
          renderItem={renderShipmentItem}
          contentContainerStyle={ClientHomeScreenStyle.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <View style={ClientHomeScreenStyle.buttonContainer}>
        <Button
          title="+ Crear Nuevo Envío"
          onPress={() => navigation.navigate('CreateShipment')}
        />
      </View>
    </SafeAreaView>
  );
};
