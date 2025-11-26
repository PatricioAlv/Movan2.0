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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@data/config/firebase.config';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import LoginScreenStyle from '../../theme/Auth-Screen-Styles/LoginScreenStyle';

export const LoginScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Por favor ingresa email y contraseña');
        return;
      }

      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by auth state listener
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Error al iniciar sesión';

      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciales inválidas';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={LoginScreenStyle.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={LoginScreenStyle.keyboardView}
      >
        <View style={LoginScreenStyle.content}>
          <Text style={LoginScreenStyle.title}>Bienvenidos a Movan</Text>
          <Text style={LoginScreenStyle.subtitle}>Conectando cargas con los transportistas de confianza</Text>

          <View style={LoginScreenStyle.form}>
            <Text style={LoginScreenStyle.inputLabel}>Email</Text>
            <Input
              style={LoginScreenStyle.inputField}
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={LoginScreenStyle.inputLabel}>Contraseña</Text>
            <Input
              style={LoginScreenStyle.inputField}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button style={LoginScreenStyle.logginButton}
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              fullWidth
            />

            <TouchableOpacity
              onPress={() => navigation?.navigate(SCREEN_NAMES.REGISTER)}
              style={LoginScreenStyle.goToRegister}
            >
              <Text style={LoginScreenStyle.registerText}>
                ¿No tienes cuenta? <Text style={LoginScreenStyle.registerTextBold}> Regístrate haciendo click aqui</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};