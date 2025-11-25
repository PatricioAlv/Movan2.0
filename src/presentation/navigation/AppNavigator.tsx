import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { ClientNavigator } from './ClientNavigator';
import { TransportistNavigator } from './TransportistNavigator';
import { auth } from '@data/config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@presentation/theme/colors';
import { container } from '@infrastructure/di/container';
import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { TYPES } from '@infrastructure/di/types';

export const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const authRepository = container.get<IAuthRepository>(TYPES.IAuthRepository);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      const user = await authRepository.getCurrentUser();
      setUserRole(user?.role ?? null);

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderNavigator = () => {
    switch (userRole) {
      case 'CLIENT':
        return <ClientNavigator />;
      case 'TRANSPORTIST':
        return <TransportistNavigator />;
      default:
        return <AuthNavigator />;
    }
  };

  return <NavigationContainer>{renderNavigator()}</NavigationContainer>;
};
