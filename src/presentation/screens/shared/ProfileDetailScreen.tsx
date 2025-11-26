import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { styles } from '@presentation/theme/Shared-Screen-Styles/ProfileDetailStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@infrastructure/utils/constants';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || 'Usuario');
        setUserRole(getRoleLabel(user.role));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
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
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
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
        </View>

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
