import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { Input } from '@presentation/components/common/Input';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '@data/config/firebase.config';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import RegisterScreenStyle from '@presentation/theme/Auth-Screen-Styles/RegisterScreenStyle';


export const RegisterScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CLIENT' | 'TRANSPORTIST' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        Alert.alert('Error', 'Todos los campos son requeridos');
        return;
      }

      if (!role) {
        Alert.alert('Error', 'Debes seleccionar un rol para usar Movan');
        return;
      }

      if (name.length < 2) {
        Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const now = Date.now();

      await set(ref(database, `users/${user.uid}`), {
        id: user.uid,
        email,
        name,
        role,
        createdAt: now,
        updatedAt: now,
      });

      Alert.alert('Éxito', 'Cuenta creada exitosamente');
      navigation?.navigate(SCREEN_NAMES.LOGIN);

    } catch (error: any) {
      console.error('Register error:', error);

      let errorMessage = 'Error al crear cuenta';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El email ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const RoleButton = ({ text, value }: { text: string; value: 'CLIENT' | 'TRANSPORTIST'}, style={}) => (
    <TouchableOpacity onPress={() => setRole(value)} style={[RegisterScreenStyle.roleButton, role === value && RegisterScreenStyle.roleButtonSelected,]}>
      <Text style={[RegisterScreenStyle.roleText, role === value && RegisterScreenStyle.roleTextSelected,]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={RegisterScreenStyle.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={RegisterScreenStyle.keyboardView}
      >
        <View style={RegisterScreenStyle.content}>
          <Text style={RegisterScreenStyle.title}>Crear Cuenta</Text>
          <Text style={RegisterScreenStyle.subtitle}>Únete a Movan</Text>

          <View style={RegisterScreenStyle.form}>
            <Text style={RegisterScreenStyle.inputLabel}>Nombre</Text>
            <Input style={RegisterScreenStyle.inputField}
              placeholder="Tu nombre"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={RegisterScreenStyle.inputLabel}>Email</Text>
            <Input style={RegisterScreenStyle.inputField}
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={RegisterScreenStyle.inputLabel}>Contraseña</Text>
            <Input style={RegisterScreenStyle.inputField}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={RegisterScreenStyle.roleLabel}> Selecciona tu rol en <Text style={RegisterScreenStyle.MovanText}>Movan</Text></Text>
            <View style={RegisterScreenStyle.roleContainer}>
              <RoleButton text="CLIENTE" value="CLIENT"/>
              <RoleButton text="TRANSPORTISTA" value="TRANSPORTIST" />
            </View>

            <Button
              title="Registrarse"
              onPress={handleRegister}
              loading={loading}
              fullWidth
            />

            <TouchableOpacity
              onPress={() => navigation?.navigate(SCREEN_NAMES.LOGIN)}
              style={RegisterScreenStyle.loginButton}
            >
              <Text style={RegisterScreenStyle.loginText}>
                ¿Ya tienes cuenta? <Text style={RegisterScreenStyle.loginTextBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
