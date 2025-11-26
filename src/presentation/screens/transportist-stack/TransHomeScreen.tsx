import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';

import { container } from '@infrastructure/di/init';
import { TYPES } from '@infrastructure/di/types';

import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';

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
  const [loading, setLoading] = useState(false); // Cambiado a false para mostrar la UI mock
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para la UI
  const [activeFilter, setActiveFilter] = useState('Nuevos');
  const [viewMode, setViewMode] = useState<'Lista' | 'Mapa'>('Lista');
  const [currentTab, setCurrentTab] = useState<'home' | 'my_shipments'>('home');

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

  // --- RENDERIZADO DE FILTROS (CHIPS) ---
  const renderFilters = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
      {['Nuevos', 'Populares', 'Cerca de mí'].map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterChip,
            activeFilter === filter && styles.filterChipActive
          ]}
          onPress={() => setActiveFilter(filter)}
        >
          <Ionicons 
            name={filter === 'Nuevos' ? 'time-outline' : filter === 'Populares' ? 'flame-outline' : 'navigate-outline'} 
            size={16} 
            color={activeFilter === filter ? '#fff' : UI_COLORS.textGray} 
            style={{ marginRight: 4 }}
          />
          <Text style={[
            styles.filterText,
            activeFilter === filter && styles.filterTextActive
          ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // --- RENDERIZADO DEL TOGGLE LISTA/MAPA ---
  const renderViewToggle = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity 
        style={[styles.toggleButton, viewMode === 'Lista' && styles.toggleButtonActive]}
        onPress={() => setViewMode('Lista')}
      >
        <Text style={[styles.toggleText, viewMode === 'Lista' && styles.toggleTextActive]}>Lista</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.toggleButton, viewMode === 'Mapa' && styles.toggleButtonActive]}
        onPress={() => setViewMode('Mapa')}
      >
        <Text style={[styles.toggleText, viewMode === 'Mapa' && styles.toggleTextActive]}>Mapa</Text>
      </TouchableOpacity>
    </View>
  );

  // ============================
  // ITEM DEL LISTADO
  // ============================
  const renderShipmentItem = ({ item }: { item: Shipment }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.shipmentId}>Envío #{item.id.slice(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.locationLabel}>Origen:</Text>
      <Text style={styles.locationAddress}>{item.origin.address}</Text>

      <Text style={styles.locationLabel}>Destino:</Text>
      <Text style={styles.locationAddress}>{item.destination.address}</Text>

      <View style={styles.actionsContainer}>
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
    </View>
  );

  if (loading) {
    return (
      <View style={TransHomeScreenStyle.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Envíos Asignados</Text>
        <Text style={styles.subtitle}>
          {shipments.length} {shipments.length === 1 ? 'envío' : 'envíos'}
        </Text>
      </View>

      {shipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🚚</Text>
          <Text style={styles.emptyTitle}>No tienes envíos asignados</Text>
          <Text style={styles.emptySubtext}>Cuando te asignen uno, aparecerá aquí</Text>
        </View>
      ) : (
        <FlatList
          data={shipments}
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
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: spacing.xs,
  },

  listContent: { padding: spacing.lg },

  card: { marginBottom: spacing.md },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shipmentId: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFFFFF',
  },

  locationLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  locationAddress: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },

  actionsContainer: { marginTop: spacing.md },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: { fontSize: 64, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
