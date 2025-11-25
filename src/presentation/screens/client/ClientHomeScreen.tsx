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
import { GetClientShipmentsUseCase } from '@core/usecases/shipments/GetClientShipmentsUseCase';
import { CancelShipmentUseCase } from '@core/usecases/shipments/CancelShipmentUseCase';
import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';

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
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.shipmentId}>Envío #{item.id.slice(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>Origen:</Text>
          <Text style={styles.locationAddress}>{item.origin.address}</Text>
          {item.origin.contactName && (
            <Text style={styles.contactInfo}>👤 {item.origin.contactName}</Text>
          )}
        </View>

        <View style={styles.arrow}>
          <Text style={styles.arrowText}>⬇</Text>
        </View>

        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>Destino:</Text>
          <Text style={styles.locationAddress}>{item.destination.address}</Text>
          {item.destination.contactName && (
            <Text style={styles.contactInfo}>👤 {item.destination.contactName}</Text>
          )}
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tipo de carga:</Text>
          <Text style={styles.detailValue}>{item.cargoType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Descripción:</Text>
          <Text style={styles.detailValue}>{item.cargoDescription}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Peso:</Text>
          <Text style={styles.detailValue}>{item.weight} kg</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Precio:</Text>
          <Text style={styles.priceValue}>${item.price.toLocaleString()}</Text>
        </View>
      </View>

      {item.status === ShipmentStatus.PENDING && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelShipment(item.id)}
        >
          <Text style={styles.cancelButtonText}>Cancelar Envío</Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Envíos</Text>
        <Text style={styles.subtitle}>
          {shipments.length} {shipments.length === 1 ? 'envío' : 'envíos'}
        </Text>
      </View>

      {shipments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📦</Text>
          <Text style={styles.emptyTitle}>No tienes envíos</Text>
          <Text style={styles.emptySubtext}>
            Crea tu primer envío para comenzar
          </Text>
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
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  listContent: {
    padding: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shipmentId: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTextArea,
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
  locationContainer: {
    marginBottom: spacing.md,
  },
  locationItem: {
    marginBottom: spacing.sm,
  },
  locationLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  locationAddress: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  contactInfo: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  arrow: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  arrowText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  priceValue: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  cancelButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#DC143C',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
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
