import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { styles } from '@presentation/theme/Shared-Screen-Styles/AccountSettingsStyle';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { LogoutUseCase } from '@core/usecases/auth/LogoutUseCase';
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
  hasArrow?: boolean;
}

interface SwitchMenuItem {
  id: string;
  label: string;
  icon: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export const AccountSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState('Usuario');
  const [userRole, setUserRole] = useState('');
  const [darkMode, setDarkMode] = useState(false);
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

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              const logoutUseCase = container.get<LogoutUseCase>(TYPES.LogoutUseCase);
              await logoutUseCase.execute();
              // La navegación será manejada por el flujo de autenticación
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const accountMenuItems: MenuItem[] = [
    {
      id: 'manage-profile',
      label: 'Gestionar Perfil',
      icon: 'user',
      onPress: () => navigation.navigate('ProfileDetail'),
      hasArrow: true,
    },
    {
      id: 'security',
      label: 'Seguridad',
      icon: 'lock',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      hasArrow: true,
    },
    {
      id: 'payment-methods',
      label: 'Métodos de Pago',
      icon: 'credit-card',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      hasArrow: true,
    },
  ];

  const appMenuItems: MenuItem[] = [
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: 'bell',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      hasArrow: true,
    },
    {
      id: 'language',
      label: 'Idioma y Región',
      icon: 'globe',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      hasArrow: true,
    },
  ];

  const supportMenuItems: MenuItem[] = [
    {
      id: 'help',
      label: 'Ayuda y Soporte',
      icon: 'question-circle',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      hasArrow: true,
    },
    {
      id: 'terms',
      label: 'Términos y Condiciones',
      icon: 'file-text',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      hasArrow: true,
    },
    {
      id: 'privacy',
      label: 'Política de Privacidad',
      icon: 'shield',
      onPress: () => Alert.alert('Próximamente', 'Esta función estará disponible pronto'),
      hasArrow: true,
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
          <FontAwesome name={item.icon as any} size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.menuItemText}>{item.label}</Text>
      </View>
      {item.hasArrow && (
        <FontAwesome name="chevron-right" size={16} color="#9198a7" />
      )}
    </TouchableOpacity>
  );

  const renderSwitchMenuItem = (item: SwitchMenuItem) => (
    <View key={item.id} style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <FontAwesome name={item.icon as any} size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.menuItemText}>{item.label}</Text>
      </View>
      <Switch
        value={item.value}
        onValueChange={item.onToggle}
        trackColor={{ false: '#767577', true: '#007AFF' }}
        thumbColor={item.value ? '#FFFFFF' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header con perfil */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configuración</Text>
        </View>

        {/* Perfil del usuario */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <FontAwesome name="user" size={40} color="#FFFFFF" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
          
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('ProfileDetail')}
          >
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Sección Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CUENTA</Text>
          {accountMenuItems.map(renderMenuItem)}
        </View>

        {/* Sección Aplicación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APLICACIÓN</Text>
          {appMenuItems.map(renderMenuItem)}
          {renderSwitchMenuItem({
            id: 'dark-mode',
            label: 'Modo Oscuro',
            icon: 'moon-o',
            value: darkMode,
            onToggle: setDarkMode,
          })}
        </View>

        {/* Sección Soporte y Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOPORTE Y LEGAL</Text>
          {supportMenuItems.map(renderMenuItem)}
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Versión de la app */}
        <Text style={styles.versionText}>Versión 2.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
