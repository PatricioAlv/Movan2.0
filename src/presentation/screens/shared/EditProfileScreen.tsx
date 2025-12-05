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
import { auth } from '@data/config/firebase.config';

const API_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;

interface Props {
  navigation: any;
}

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      const response = await fetch(`${API_URL}/users/${currentUser.uid}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del usuario');
      }
      
      const user = await response.json();
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

      const response = await fetch(`${API_URL}/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'No se pudo actualizar el perfil');
      }

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
