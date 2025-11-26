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
          style={TransShipmentBrowser.searchInput}
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