import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { styles } from '@presentation/theme/Shared-Screen-Styles/EditProfileStyle';
import { Input } from '@presentation/components/common/Input';
import { Button } from '@presentation/components/common/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { GetUserUseCase } from '@core/usecases/user/GetUserUseCase';
import { UpdateUserUseCase } from '@core/usecases/user/UpdateUserUseCase';
import { auth } from '@data/config/firebase.config';

interface Props {
  navigation: any;
}

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getUserUseCase = container.get<GetUserUseCase>(TYPES.GetUserUseCase);
  const updateUserUseCase = container.get<UpdateUserUseCase>(TYPES.UpdateUserUseCase);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'No hay usuario autenticado');
        navigation.goBack();
        return;
      }

      const user = await getUserUseCase.execute(currentUser.uid);
      if (user) {
        setName(user.name);
        setPhone(user.phone || '');
        setEmail(user.email);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      await updateUserUseCase.execute(currentUser.uid, {
        name: name.trim(),
        phone: phone.trim() || undefined,
      });

      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando...</Text>
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
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMACIÓN PERSONAL</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <Input
                placeholder="Ingresa tu nombre completo"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <Input
                placeholder="10 dígitos"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <Input
                placeholder="tu@email.com"
                value={email}
                editable={false}
              />
              <Text style={styles.helperText}>
                El correo no se puede modificar
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={saving ? 'Guardando...' : 'Guardar cambios'}
              onPress={handleSave}
              disabled={saving}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
