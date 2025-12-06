import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ClientHomeScreenStyle from '@presentation/theme/Client-Screen-Styles/ClientHomeScreenStyle';

const API_BASE_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

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

      const response = await fetch(`${API_BASE_URL}/shipments/client/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar envíos');
      }

      setShipments(data);
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
    
    // Recargar cuando la pantalla recibe el foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadShipments();
    });
    
    return unsubscribe;
  }, [navigation]);

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
              const response = await fetch(`${API_BASE_URL}/cancelShipment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shipmentId }),
              });
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.error || 'No se pudo cancelar el envío');
              }
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
      style={ClientHomeScreenStyle.card}
      onPress={() => navigation.navigate('ClientShipmentDetails', { shipmentId: item.id })}
      activeOpacity={0.7}
    >
      <View style={ClientHomeScreenStyle.cardHeader}>
        <View>
          <Text style={ClientHomeScreenStyle.shipmentId}>ID: #{item.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={ClientHomeScreenStyle.cargoType}>{item.cargoType}</Text>
        </View>
        <View style={[ClientHomeScreenStyle.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
          <View style={[ClientHomeScreenStyle.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[ClientHomeScreenStyle.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={ClientHomeScreenStyle.routeContainer}>
        <View style={ClientHomeScreenStyle.locationPoint}>
          <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <Text style={ClientHomeScreenStyle.locationCity} numberOfLines={1}>
            {item.origin.address.split(',')[0]}
          </Text>
        </View>
        <FontAwesome name="long-arrow-right" size={16} color="#64748B" style={ClientHomeScreenStyle.routeArrow} />
        <View style={ClientHomeScreenStyle.locationPoint}>
          <FontAwesome name="map-marker" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <Text style={ClientHomeScreenStyle.locationCity} numberOfLines={1}>
            {item.destination.address.split(',')[0]}
          </Text>
        </View>
      </View>

      <View style={ClientHomeScreenStyle.infoRow}>
        <View style={ClientHomeScreenStyle.infoItem}>
          <Text style={ClientHomeScreenStyle.infoLabel}>Peso:</Text>
          <Text style={ClientHomeScreenStyle.infoValue}>{item.weight} kg</Text>
        </View>
        <View style={ClientHomeScreenStyle.infoItem}>
          <Text style={ClientHomeScreenStyle.infoLabel}>Precio:</Text>
          <Text style={ClientHomeScreenStyle.priceValue}>${item.price.toLocaleString()}</Text>
        </View>
      </View>

      {item.driverId && (
        <View style={ClientHomeScreenStyle.driverAssignedBanner}>
          <Text style={ClientHomeScreenStyle.driverAssignedText}>
            ✓ Transportista asignado
          </Text>
        </View>
      )}

      {item.status === ShipmentStatus.PENDING && (
        <TouchableOpacity
          style={ClientHomeScreenStyle.cancelButton}
          onPress={() => handleCancelShipment(item.id)}
        >
          <Text style={ClientHomeScreenStyle.cancelButtonText}>✕ Cancelar Envío</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={ClientHomeScreenStyle.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const filteredShipments = getFilteredShipments();

  return (
    <SafeAreaView style={ClientHomeScreenStyle.container}>
      <View style={ClientHomeScreenStyle.header}>
        <Text style={ClientHomeScreenStyle.title}>Mis Envíos</Text>
        <View style={ClientHomeScreenStyle.tabContainer}>
          <TouchableOpacity 
            style={[ClientHomeScreenStyle.tabButton, activeTab === 'active' && ClientHomeScreenStyle.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[ClientHomeScreenStyle.tabText, activeTab === 'active' && ClientHomeScreenStyle.tabTextActive]}>
              En Curso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[ClientHomeScreenStyle.tabButton, activeTab === 'history' && ClientHomeScreenStyle.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[ClientHomeScreenStyle.tabText, activeTab === 'history' && ClientHomeScreenStyle.tabTextActive]}>
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredShipments.length === 0 ? (
        <View style={ClientHomeScreenStyle.emptyContainer}>
          <FontAwesome name="dropbox" size={50} color="#2A2D32" style={{ marginBottom: 16 }} />
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