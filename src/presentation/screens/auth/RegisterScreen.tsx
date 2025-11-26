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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '@data/config/firebase.config';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';

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

  const RoleButton = ({ text, value }: { text: string; value: 'CLIENT' | 'TRANSPORTIST' }, style = {}) => (
    <TouchableOpacity onPress={() => setRole(value)} style={[styles.roleButton, role === value && styles.roleButtonSelected,]}>
      <Text style={[styles.roleText, role === value && styles.roleTextSelected,]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a Movan!</Text>

          <View style={styles.form}>
            <Input
              label="Nombre"
              style={styles.inputField}
              placeholder="Tu nombre"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Input
              label="Email"
              placeholder="tu@email.com"
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Contraseña"
              style={styles.inputField}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.roleLabel}> Selecciona tu rol en Movan</Text>
            <View style={styles.roleContainer}>
              <RoleButton text="CLIENTE" value="CLIENT" />
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
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text>
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
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: {
    marginTop: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  loginTextBold: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  roleLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.bold,
  },
  roleContainer: {
    flexDirection: 'row',
    top: 5,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  roleTextSelected: {
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  inputField: {
    backgroundColor: colors.bgLight,
    borderColor: colors.gray500


  }
});
