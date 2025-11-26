import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, FlatList, TextInput, Alert } from 'react-native';
import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import TransShipmentBrowser from '@presentation/theme/Trans-Screen-Styles/TransShipmentBrowser';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { Shipment } from '@core/entities/Order';
import { GetAvailableShipmentsUseCase } from '@core/usecases/shipments/GetAvailableShipmentsUseCase';

interface Props {
  navigation: any;
}

export const TransportistBrowserScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [results, setResults] = useState<Shipment[]>([]);

  const loadAvailableShipments = async () => {
    try {
      setLoading(true);

      const getAvailableShipmentsUseCase = container.get<GetAvailableShipmentsUseCase>(
        TYPES.GetAvailableShipmentsUseCase
      );
      const data = await getAvailableShipmentsUseCase.execute();

      setAllShipments(data);
      filterShipments(data, query);
    } catch (err) {
      console.error('Error loading shipments:', err);
      Alert.alert('Error', 'No se pudieron cargar los pedidos disponibles');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterShipments = (shipments: Shipment[], searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(shipments);
      return;
    }

    const filtered = shipments.filter((shipment) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        shipment.origin.address.toLowerCase().includes(searchLower) ||
        shipment.destination.address.toLowerCase().includes(searchLower) ||
        shipment.cargoDescription.toLowerCase().includes(searchLower) ||
        shipment.cargoType.toLowerCase().includes(searchLower)
      );
    });

    setResults(filtered);
  };

  useEffect(() => {
    loadAvailableShipments();
  }, []);

  useEffect(() => {
    filterShipments(allShipments, query);
  }, [query]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAvailableShipments();
  };

  const renderItem = ({ item }: { item: Shipment }) => ( // Render de cada pedido
    <Card style={TransShipmentBrowser.card}>
      <View style={TransShipmentBrowser.cardHeader}>
        <Text style={TransShipmentBrowser.shipmentId}>Pedido #{item.id?.slice(0, 8) ?? '---'}</Text>
      </View>

      <View style={TransShipmentBrowser.locationContainer}>
        <Text style={TransShipmentBrowser.locationLabel}>Origen:</Text>
        <Text style={TransShipmentBrowser.locationValue}>{item.origin?.address ?? '---'}</Text>

        <Text style={[TransShipmentBrowser.locationLabel, { marginTop: spacing.sm }]}>Destino:</Text>
        <Text style={TransShipmentBrowser.locationValue}>{item.destination?.address ?? '---'}</Text>
      </View>

      <View style={TransShipmentBrowser.detailsContainer}>
        <Text style={TransShipmentBrowser.detailText}>Carga: {item.cargoType ?? '---'}</Text>
        <Text style={TransShipmentBrowser.detailText}>Peso: {item.weight ?? '---'} kg</Text>
        <Text style={TransShipmentBrowser.detailText}>
          Fecha: {item.pickupDate ? new Date(item.pickupDate).toLocaleDateString() : '---'}
        </Text>
        <Text style={TransShipmentBrowser.detailPrice}>${item.price?.toLocaleString() ?? '---'}</Text>
      </View>

      <Button
        title="Ver Detalles"
        onPress={() => navigation.navigate('TransportistShipmentDetails', { shipmentId: item.id })}
        style={{ marginTop: spacing.sm }}
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={TransShipmentBrowser.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={TransShipmentBrowser.container}>
      <View style={TransShipmentBrowser.header}>
        <Text style={TransShipmentBrowser.title}>Buscador de Envíos</Text>
        <Text style={TransShipmentBrowser.subtitle}>
          {results.length} resultados
        </Text>
      </View>

      <View style={TransShipmentBrowser.searchContainer}>
        <TextInput
          placeholder="Buscar dirección, ciudad o referencia…"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          onSubmitEditing={loadAvailableShipments}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={renderItem}
        contentContainerStyle={TransShipmentBrowser.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={TransShipmentBrowser.emptyContainer}>
            <Text style={TransShipmentBrowser.emptyIcon}>🔍</Text>
            <Text style={TransShipmentBrowser.emptyTitle}>No se encontraron pedidos</Text>
            <Text style={TransShipmentBrowser.emptySubtitle}>
              Probá otra búsqueda o ajustá los filtros.
            </Text>
          </View>
        }
      />
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

  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
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
    marginBottom: spacing.md,
  },
  shipmentId: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textTextArea,
  },

  locationContainer: {
    marginBottom: spacing.md,
  },
  locationLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
  },
  locationValue: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },

  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  detailPrice: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.xs,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
