import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { styles } from '@presentation/theme/Shared-Screen-Styles/ProfileDetailStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@infrastructure/utils/constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { GetUserUseCase } from '@core/usecases/user/GetUserUseCase';
import { UserRatingDisplay } from '@presentation/components/common/UserRatingDisplay';
import { RatingList } from '@presentation/components/common/RatingList';
import { auth } from '@data/config/firebase.config';

interface Props {
  navigation: any;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

export const ProfileDetailScreen: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState('Usuario');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | undefined>();
  const [totalRatings, setTotalRatings] = useState<number | undefined>();
  const [showRatings, setShowRatings] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const getUserUseCase = container.get<GetUserUseCase>(TYPES.GetUserUseCase);

  useEffect(() => {
    loadUserData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No user authenticated');
        return;
      }

      const user = await getUserUseCase.execute(currentUser.uid);
      if (user) {
        setUserId(currentUser.uid);
        setUserName(user.name || 'Usuario');
        setUserEmail(user.email);
        setUserPhone(user.phone || 'No configurado');
        setUserRole(getRoleLabel(user.role));
        setAverageRating(user.averageRating);
        setTotalRatings(user.totalRatings);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string): string => {
    const roleLabels: Record<string, string> = {
      client: 'Cliente',
      transportist: 'Transportista',
      admin: 'Administrador',
    };
    return roleLabels[role] || role;
  };

  const personalInfoItems: MenuItem[] = [
    {
      id: 'edit-personal',
      label: 'Editar Información personal',
      icon: 'user',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'contact-data',
      label: 'Datos de contacto',
      icon: 'phone',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
    },
    {
      id: 'credentials',
      label: 'Credenciales de acceso',
      icon: 'lock',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
    },
  ];

  const driverInfoItems: MenuItem[] = [
    {
      id: 'vehicle-details',
      label: 'Detalles del vehículo',
      icon: 'truck',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
    },
    {
      id: 'license-documents',
      label: 'Licencia y documentos',
      icon: 'file-text',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <FontAwesome name={item.icon as any} size={18} color="#FFFFFF" />
        </View>
        <Text style={styles.menuItemText}>{item.label}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#9198a7" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ marginTop: 16, fontSize: 16, color: '#9CA3AF' }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <FontAwesome name="user" size={50} color="#FFFFFF" />
              </View>
            )}
            <TouchableOpacity style={styles.editImageButton}>
              <FontAwesome name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
          
          {/* Ratings */}
          {totalRatings !== undefined && totalRatings > 0 && (
            <View style={styles.ratingsContainer}>
              <UserRatingDisplay
                averageRating={averageRating}
                totalRatings={totalRatings}
                size="medium"
                showLabel
              />
            </View>
          )}
        </View>

        {/* Mis Calificaciones */}
        {totalRatings !== undefined && totalRatings > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.ratingsHeader}
              onPress={() => setShowRatings(!showRatings)}
              activeOpacity={0.7}
            >
              <View style={styles.ratingsHeaderLeft}>
                <FontAwesome name="star" size={18} color="#FFD700" />
                <Text style={styles.sectionTitle}>MIS CALIFICACIONES</Text>
              </View>
              <FontAwesome
                name={showRatings ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#9198a7"
              />
            </TouchableOpacity>
            
            {showRatings && (
              <View style={styles.ratingsListContainer}>
                <RatingList userId={userId} />
              </View>
            )}
          </View>
        )}

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>
          {personalInfoItems.map(renderMenuItem)}
        </View>

        {/* Información del Transportista (solo si es transportista) */}
        {userRole === 'Transportista' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMACIÓN DE TRANSPORTISTA</Text>
            {driverInfoItems.map(renderMenuItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
