import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { ClientNavigator } from './ClientNavigator';
import { TransportistNavigator } from './TransportistNavigator';
import { auth } from '@data/config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@presentation/theme/colors';
import { SplashScreen } from '@presentation/screens/SplashScreen';
import { WelcomeScreen } from '@presentation/screens/WelcomeScreen';

const API_URL = `http://${process.env.LOCAL_IP}:5001/movan-857e9/us-central1/api`;
console.log('API_URL:', API_URL);

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('firebaseUser:', firebaseUser);
      if (!firebaseUser) {
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/${firebaseUser.uid}`);
        if (response.ok) {
          const user = await response.json();
          console.log('user:', user);
          setUserRole(user?.role ?? null);
          setHasSeenWelcome(true);
        } else {
          console.error('Error obteniendo usuario');
          setUserRole(null);
        }
      } catch (e) {
        console.error('Error en getCurrentUser:', e);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if(showSplash){
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

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
        // Si no está autenticado, mostrar Welcome primero
        if (!hasSeenWelcome) {
          return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Auth" component={AuthNavigator} />
            </Stack.Navigator>
          );
        }
        return <AuthNavigator />;
    }
  };

  return <NavigationContainer>{renderNavigator()}</NavigationContainer>;
};
