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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@presentation/components/common/Card';
import { Button } from '@presentation/components/common/Button';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';

import { Shipment, ShipmentStatus } from '@core/entities/Order';
import { auth } from '@data/config/firebase.config';
import { TransportistBrowserScreen } from './TransShipmentBrowser';

// --- DATOS DE PRUEBA PARA LA UI (MOCK) ---
const MOCK_LOADS = [
  {
    id: '1',
    type: 'Contenedor',
    weight: '40,000 lbs',
    origin: 'Los Angeles, CA',
    destination: 'Phoenix, AZ',
    distance: '373 mi',
    price: '$1,200',
    icon: 'cube-outline' as const,
  },
  {
    id: '2',
    type: 'Carga General',
    weight: '25,000 lbs',
    origin: 'Dallas, TX',
    destination: 'Houston, TX',
    distance: '240 mi',
    price: '$850',
    icon: 'truck-outline' as const,
  },
  {
    id: '3',
    type: 'Refrigerado',
    weight: '30,000 lbs',
    origin: 'Miami, FL',
    destination: 'Atlanta, GA',
    distance: '663 mi',
    price: '$2,100',
    icon: 'snow-outline' as const,
  },
];

// --- COLORES ESPECÍFICOS DEL DISEÑO OSCURO ---
const UI_COLORS = {
  cardBg: '#1e293b', // Azul oscuro grisáceo
  accentBlue: '#2563eb', // Azul brillante botón
  accentYellow: '#fbbf24', // Amarillo precio
  textGray: '#94a3b8',
  bgDark: '#0f172a', // Fondo muy oscuro
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

  // --- RENDERIZADO DE LA TARJETA DE CARGA (NUEVO DISEÑO) ---
  const renderLoadItem = ({ item }: { item: typeof MOCK_LOADS[0] }) => (
    <View style={styles.loadCard}>
      {/* Encabezado: Icono y Tipo */}
      <View style={styles.loadHeader}>
        <Ionicons name={item.icon as any} size={20} color={UI_COLORS.textGray} />
        <Text style={styles.loadType}>{item.type} - {item.weight}</Text>
      </View>

      {/* Ruta */}
      <View style={styles.routeContainer}>
        <Text style={styles.routeText}>
          {item.origin.split(',')[0]} <Ionicons name="arrow-forward" size={16} color="#fff" /> {item.destination.split(',')[0]}
        </Text>
        <Text style={styles.routeSubtext}>
          {item.origin} → {item.destination}
        </Text>
      </View>

      {/* Distancia */}
      <Text style={styles.distanceText}>Distancia: {item.distance}</Text>

      {/* Footer: Precio y Botón */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.priceLabel}>Pago:</Text>
          <Text style={styles.priceValue}>{item.price}</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Ver Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
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
      <View style={{ flex: 1 }}>
        {currentTab === 'home' ? (
          <>
            {/* Header existente */}
            <View style={styles.header}>
              <Text style={styles.title}>Envíos Disponibles</Text>
              <Text style={styles.subtitle}>Encuentra tu próxima carga</Text>
            </View>

            <View style={styles.contentContainer}>
              {/* Buscador */}
              <TouchableOpacity
                style={styles.searcher}
                onPress={() => Alert.alert('Buscar', 'Funcionalidad pendiente')}
              >
                <Text style={styles.textSearcher}> Buscar ruta o ciudad...</Text>
              </TouchableOpacity>

              {/* Nuevos Componentes de UI */}
              <View style={{ marginBottom: 10 }}>
                {renderFilters()}
              </View>

              {renderViewToggle()}

              {/* Lista de Cargas */}
              <FlatList
                data={MOCK_LOADS}
                keyExtractor={(item) => item.id}
                renderItem={renderLoadItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </>
        ) : (
          <TransportistBrowserScreen navigation={navigation} />
        )}
      </View>

      {/* Barra de Navegación Inferior */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setCurrentTab('home')}
        >
          <Ionicons 
            name={currentTab === 'home' ? "home" : "home-outline"} 
            size={24} 
            color={currentTab === 'home' ? UI_COLORS.accentBlue : UI_COLORS.textGray} 
          />
          <Text style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setCurrentTab('my_shipments')}
        >
          <Ionicons 
            name={currentTab === 'my_shipments' ? "list" : "list-outline"} 
            size={24} 
            color={currentTab === 'my_shipments' ? UI_COLORS.accentBlue : UI_COLORS.textGray} 
          />
          <Text style={[styles.tabLabel, currentTab === 'my_shipments' && styles.tabLabelActive]}>Mis Envíos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI_COLORS.bgDark }, // Fondo oscuro general
  contentContainer: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: UI_COLORS.bgDark },

  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: UI_COLORS.bgDark, // Header oscuro
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: UI_COLORS.textGray,
    marginTop: spacing.xs,
  },

  // Buscador
  searcher: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: UI_COLORS.cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textSearcher: {
    color: UI_COLORS.textGray,
    fontSize: typography.fontSize.base,
  },

  // Filtros (Chips)
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexGrow: 0,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_COLORS.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#1d4ed8', // Azul más oscuro para activo
    borderColor: UI_COLORS.accentBlue,
  },
  filterText: {
    color: UI_COLORS.textGray,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },

  // Toggle Lista/Mapa
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: UI_COLORS.cardBg,
    marginHorizontal: spacing.lg,
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.md,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#334155',
  },
  toggleText: {
    color: UI_COLORS.textGray,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },

  // Lista
  listContent: { 
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Tarjeta de Carga (Load Card)
  loadCard: {
    backgroundColor: UI_COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadType: {
    color: UI_COLORS.textGray,
    marginLeft: 8,
    fontSize: 14,
  },
  routeContainer: {
    marginBottom: 8,
  },
  routeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  distanceText: {
    color: UI_COLORS.textGray,
    fontSize: 14,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  priceLabel: {
    color: UI_COLORS.textGray,
    fontSize: 12,
  },
  priceValue: {
    color: UI_COLORS.accentYellow,
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: UI_COLORS.accentBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // --- ESTILOS DE LA BARRA INFERIOR ---
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: UI_COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingBottom: spacing.sm, // Ajuste para dispositivos sin botón físico
    paddingTop: spacing.sm,
    height: 65,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: UI_COLORS.textGray,
  },
  tabLabelActive: {
    color: UI_COLORS.accentBlue,
    fontWeight: 'bold',
  },
});
