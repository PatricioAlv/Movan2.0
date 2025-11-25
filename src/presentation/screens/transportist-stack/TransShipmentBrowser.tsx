import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';
import { container } from '@infrastructure/di/init';
import { TYPES } from '@infrastructure/di/types';

// IMPORTS PARA GOOGLE MAPS / PLACES (agregalos cuando los uses)
// import { usePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// ENTIDAD A USAR CUANDO COMPLETES LA LÓGICA
// import { Shipment } from '@core/entities/Order';

export const TransportistBrowserScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [results, setResults] = useState([]); // <Shipment[]> cuando conectes todo

  const loadAvailableShipments = async () => {
    try {
      setLoading(true);

      // const getAvailableShipmentsUseCase = container.get(
      //   TYPES.GetAvailableShipmentsUseCase
      // );
      // const data = await getAvailableShipmentsUseCase.execute(query);

      // setResults(data);
      setResults([]); // placeholder visual
    } catch (err) {
      console.error('Error loading shipments:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAvailableShipments();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAvailableShipments();
  };

  const renderItem = ({ item }) => ( // Render de cada pedido
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.shipmentId}>Pedido #{item.id?.slice(0, 8) ?? '---'}</Text>
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Origen:</Text>
        <Text style={styles.locationValue}>{item.origin?.address ?? '---'}</Text>

        <Text style={[styles.locationLabel, { marginTop: spacing.sm }]}>Destino:</Text>
        <Text style={styles.locationValue}>{item.destination?.address ?? '---'}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Carga: {item.cargoType ?? '---'}</Text>
        <Text style={styles.detailText}>Peso: {item.weight ?? '---'} kg</Text>
        <Text style={styles.detailPrice}>${item.price?.toLocaleString() ?? '---'}</Text>
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscador de Envíos</Text>
        <Text style={styles.subtitle}>
          {results.length} resultados
        </Text>
      </View>

      <View style={styles.searchContainer}>
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
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No se encontraron pedidos</Text>
            <Text style={styles.emptySubtitle}>
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
