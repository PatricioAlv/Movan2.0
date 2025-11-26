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
import { useFocusEffect } from '@react-navigation/native';

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

  // Recargar cuando la pantalla recibe foco (vuelve de detalles)
  useFocusEffect(
    React.useCallback(() => {
      loadAvailableShipments();
    }, [])
  );

  useEffect(() => {
    filterShipments(allShipments, query);
  }, [query]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAvailableShipments();
  };

  const renderItem = ({ item }: { item: Shipment }) => (
    <View style={TransShipmentBrowser.card}>
      {/* Header con tipo de carga y peso */}
      <View style={TransShipmentBrowser.cardHeader}>
        <View>
          <Text style={TransShipmentBrowser.cargoType}>{item.cargoDescription}</Text>
          <Text style={TransShipmentBrowser.weightText}>{item.weight} kg</Text>
        </View>
      </View>

      {/* Ruta: Origen -> Destino */}
      <View style={TransShipmentBrowser.routeContainer}>
        <View style={TransShipmentBrowser.locationPoint}>
          <Text style={TransShipmentBrowser.locationIcon}>📍</Text>
          <Text style={TransShipmentBrowser.locationCity}>
            {item.origin.address.split(',')[0]}
          </Text>
        </View>
        <Text style={TransShipmentBrowser.routeArrow}>→</Text>
        <View style={TransShipmentBrowser.locationPoint}>
          <Text style={TransShipmentBrowser.locationIcon}>📍</Text>
          <Text style={TransShipmentBrowser.locationCity}>
            {item.destination.address.split(',')[0]}
          </Text>
        </View>
      </View>

      {/* Distancia y duración */}
      <View style={TransShipmentBrowser.infoRow}>
        <Text style={TransShipmentBrowser.infoText}>Distancia: {Math.round(Math.random() * 500 + 100)} km</Text>
        <Text style={TransShipmentBrowser.infoText}>⏱️ {Math.round(Math.random() * 20 + 5)}h</Text>
      </View>

      {/* Precio y botón */}
      <View style={TransShipmentBrowser.footer}>
        <View>
          <Text style={TransShipmentBrowser.priceLabel}>Pago:</Text>
          <Text style={TransShipmentBrowser.price}>${item.price.toLocaleString('es-ES')}</Text>
        </View>
        <Button
          title="Ver Detalles"
          onPress={() => navigation.navigate('TransportistShipmentDetails', { shipmentId: item.id })}
        />
      </View>
    </View>
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
        <Text style={TransShipmentBrowser.title}>Encuentra Cargas</Text>
        <View style={TransShipmentBrowser.tabContainer}>
          <Text style={TransShipmentBrowser.tabActive}>Nuevos</Text>
          <Text style={TransShipmentBrowser.tabInactive}>Populares</Text>
          <Text style={TransShipmentBrowser.tabInactive}>Cerca de mí</Text>
        </View>
      </View>

      <View style={TransShipmentBrowser.searchContainer}>
        <Text style={TransShipmentBrowser.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Buscar por ciudad, estado o ID"
          placeholderTextColor="#6B7280"
          value={query}
          onChangeText={setQuery}
          style={TransShipmentBrowser.searchInput}
        />
      </View>

      <View style={TransShipmentBrowser.filterContainer}>
        <View style={TransShipmentBrowser.filterButton}>
          <Text style={TransShipmentBrowser.filterText}>Lista</Text>
        </View>
        <View style={TransShipmentBrowser.filterButtonInactive}>
          <Text style={TransShipmentBrowser.filterTextInactive}>Mapa</Text>
        </View>
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