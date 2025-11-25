import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@presentation/components/common/Button';
import { Input } from '@presentation/components/common/Input';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';
import { typography } from '@presentation/theme/typography';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@data/config/firebase.config';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Bienvenidos a Movan</Text>
          <Text style={styles.subtitle}>Conectando cargas con los transportistas de confianza</Text>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Email</Text>
            <Input
              style={styles.inputField}
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Contraseña</Text>
            <Input
              style={styles.inputField}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              fullWidth
            />

            <TouchableOpacity
              onPress={() => navigation?.navigate(SCREEN_NAMES.REGISTER)}
              style={styles.registerButton}
            >
              <Text style={styles.registerText}>
                ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate como:</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttons: {
    marginTop: spacing.md,
    backgroundColor: colors.bgLight,
    color: colors.gray500
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    marginTop: spacing.lg,
  },
  registerButton: {
    marginTop: spacing['3xl'],
    alignItems: 'center',
  },
  registerText: {
    fontSize: typography.fontSize.sm,
    color: colors.white,
  },
  registerTextBold: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  inputLabel: {
    marginBottom: spacing.sm,
    color: colors.white,
  },
  inputField: {
    backgroundColor: colors.bgLight,
    borderColor: colors.gray500
  },
});
