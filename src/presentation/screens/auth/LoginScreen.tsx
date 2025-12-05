import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { Input } from '@presentation/components/common/Input';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import LoginScreenStyle from '../../theme/Auth-Screen-Styles/LoginScreenStyle';

export const LoginScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error ', 'Por favor ingresa email y contrasña');
        return;
      }

      setLoading(true);
      
      const response = await fetch(`${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password}),
      });

      const data = await response.json();

      if (!response.ok){
        throw new Error(data.error || 'Error al iniciar sesion');
      }

      Alert.alert('Exito', 'Inicio de sesion exitoso');
      navigation?.navigate(SCREEN_NAMES.HOME); //revisar if ok

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
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
          <View style={{ alignSelf: 'center', marginBottom: 30, backgroundColor: '#0051D5', borderRadius: 20, padding: 10 }}>
            <Image 
              source={require('../../../../assets/logomovan.png')} 
              style={{ width: 120, height: 120 }} 
              resizeMode="contain" 
            />
          </View>
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