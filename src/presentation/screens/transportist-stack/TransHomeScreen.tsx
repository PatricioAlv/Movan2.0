import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import { API_ENDPOINTS } from '@infrastructure/utils/constants';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import TransHomeScreenStyle from '@presentation/theme/Trans-Screen-Styles/TransHomeScreen';

const API_BASE_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

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

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_DRIVER_SHIPMENTS}/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar los envíos');
      }

      // La API devuelve un array directo de shipments
      setShipments(Array.isArray(data) ? data : []);

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
          <View style={[TransHomeScreenStyle.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
            <View style={[TransHomeScreenStyle.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[TransHomeScreenStyle.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* Ruta: Origen -> Destino */}
        <View style={TransHomeScreenStyle.routeContainer}>
          <View style={TransHomeScreenStyle.locationPoint}>
            <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <Text style={TransHomeScreenStyle.locationCity}>
              {item.origin.address.split(',')[0]}
            </Text>
          </View>
          <FontAwesome name="long-arrow-right" size={16} color="#64748B" style={TransHomeScreenStyle.routeArrow} />
          <View style={TransHomeScreenStyle.locationPoint}>
            <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <Text style={TransHomeScreenStyle.locationCity}>
              {item.destination.address.split(',')[0]}
            </Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={TransHomeScreenStyle.dateContainer}>
          <FontAwesome name="calendar" size={14} color="#64748B" style={{ marginRight: 8 }} />
          <Text style={TransHomeScreenStyle.dateText}>
            {item.status === ShipmentStatus.DELIVERED ? 'Entregado: ' : 'Recogida: '}
            {new Date(item.pickupDate).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
          <TouchableOpacity style={TransHomeScreenStyle.moreButton}>
            <FontAwesome name="ellipsis-v" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={TransHomeScreenStyle.centerContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={TransHomeScreenStyle.container}>
      <View style={TransHomeScreenStyle.header}>
        <Text style={TransHomeScreenStyle.title}>Mis Envíos</Text>
        <View style={TransHomeScreenStyle.tabContainer}>
          <TouchableOpacity 
            style={[TransHomeScreenStyle.tabButton, activeTab === 'current' && TransHomeScreenStyle.tabActive]}
            onPress={() => setActiveTab('current')}
          >
            <Text style={[TransHomeScreenStyle.tabText, activeTab === 'current' && TransHomeScreenStyle.tabTextActive]}>
              En Curso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[TransHomeScreenStyle.tabButton, activeTab === 'history' && TransHomeScreenStyle.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[TransHomeScreenStyle.tabText, activeTab === 'history' && TransHomeScreenStyle.tabTextActive]}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {displayedShipments.length === 0 ? (
        <View style={TransHomeScreenStyle.emptyContainer}>
          <FontAwesome name="truck" size={50} color="#2A2D32" style={{ marginBottom: 16 }} />
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
