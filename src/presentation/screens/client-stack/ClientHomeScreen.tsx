import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { container } from '@infrastructure/di/init';
import { TYPES } from '@infrastructure/di/types';
import { GetClientShipmentsUseCase } from '@core/usecases/shipments/GetClientShipmentsUseCase';
import { CancelShipmentUseCase } from '@core/usecases/shipments/CancelShipmentUseCase';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      return 'Pendiente';
    case ShipmentStatus.ACCEPTED:
      return 'Aceptado';
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
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ClientShipmentDetails', { shipmentId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.shipmentId}>ID: #{item.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.cargoType}>{item.cargoType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationPoint}>
          <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <Text style={styles.locationCity} numberOfLines={1}>
            {item.origin.address.split(',')[0]}
          </Text>
        </View>
        <FontAwesome name="long-arrow-right" size={16} color="#64748B" style={styles.routeArrow} />
        <View style={styles.locationPoint}>
          <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <Text style={styles.locationCity} numberOfLines={1}>
            {item.destination.address.split(',')[0]}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Peso:</Text>
          <Text style={styles.infoValue}>{item.weight} kg</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Precio:</Text>
          <Text style={styles.priceValue}>${item.price.toLocaleString()}</Text>
        </View>
      </View>

      {item.driverId && (
        <View style={styles.driverAssignedBanner}>
          <Text style={styles.driverAssignedText}>
            ✓ Transportista asignado
          </Text>
        </View>
      )}

      {item.status === ShipmentStatus.PENDING && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelShipment(item.id)}
        >
          <Text style={styles.cancelButtonText}>✕ Cancelar Envío</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const filteredShipments = getFilteredShipments();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Envíos</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              En Curso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredShipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="dropbox" size={50} color="#2A2D32" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>
            {activeTab === 'active' ? 'No tienes envíos activos' : 'No hay historial'}
          </Text>
          <Text style={styles.emptySubtext}>
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
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="+ Crear Nuevo Envío"
          onPress={() => navigation.navigate('CreateShipment')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Navy Blue Background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 20,
    backgroundColor: '#0F172A',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // Slate 700
  },
  tabButton: {
    marginRight: 20,
    paddingBottom: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    color: '#94A3B8', // Slate 400
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for floating button
  },
  card: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  shipmentId: {
    fontSize: 12,
    color: '#64748B', // Slate 500
    marginBottom: 4,
  },
  cargoType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F1F5F9', // Slate 100
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationCity: {
    color: '#E2E8F0', // Slate 200
    fontSize: 14,
    flex: 1,
  },
  routeArrow: {
    marginHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#F1F5F9',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: '#10B981', // Green for money
    fontWeight: 'bold',
  },
  driverAssignedBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  driverAssignedText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#0F172A',
  },
});
