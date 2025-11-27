import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@presentation/theme/colors';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { GetDriverShipmentsUseCase } from '@core/usecases/shipments/GetDriverShipmentsUseCase';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const getStatusColor = (status: ShipmentStatus): string => {
  switch (status) {
    case ShipmentStatus.PENDING:
      return '#F59E0B'; // Orange
    case ShipmentStatus.ACCEPTED:
      return '#3B82F6'; // Blue
    case ShipmentStatus.IN_TRANSIT:
      return '#F59E0B'; // Blue
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
      <View style={styles.card}>
        {/* Header con ID y Status Badge */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.shipmentId}>ID: #{item.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.cargoType}>{item.cargoDescription}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* Ruta: Origen -> Destino */}
        <View style={styles.routeContainer}>
          <View style={styles.locationPoint}>
            <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <Text style={styles.locationCity}>
              {item.origin.address.split(',')[0]}
            </Text>
          </View>
          <FontAwesome name="long-arrow-right" size={16} color="#64748B" style={styles.routeArrow} />
          <View style={styles.locationPoint}>
            <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <Text style={styles.locationCity}>
              {item.destination.address.split(',')[0]}
            </Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.dateContainer}>
          <FontAwesome name="calendar" size={14} color="#64748B" style={{ marginRight: 8 }} />
          <Text style={styles.dateText}>
            {item.status === ShipmentStatus.DELIVERED ? 'Entregado: ' : 'Recogida: '}
            {new Date(item.pickupDate).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
          <TouchableOpacity style={styles.moreButton}>
            <FontAwesome name="ellipsis-v" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Envíos</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'current' && styles.tabActive]}
            onPress={() => setActiveTab('current')}
          >
            <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>
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

      {displayedShipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="truck" size={50} color="#2A2D32" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>
            {activeTab === 'current' ? 'No tienes envíos en curso' : 'No hay envíos en el historial'}
          </Text>
          <Text style={styles.emptySubtext}>
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
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
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
  },
  card: {
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0, // Removed border to match image cleaner look
    // Optional: Add shadow if needed, but image looks flat/clean
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0, // Removed margin top to align with image
    paddingTop: 0, // Removed padding top
    borderTopWidth: 0, // Removed border
  },
  dateText: {
    color: '#94A3B8', // Slate 400
    fontSize: 13,
    flex: 1,
  },
  moreButton: {
    padding: 4,
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
});
