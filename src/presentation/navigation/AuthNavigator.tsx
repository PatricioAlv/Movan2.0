import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '@presentation/screens/auth/LoginScreen';
import { RegisterScreen } from '@presentation/screens/auth/RegisterScreen';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';

const Stack = createStackNavigator();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={SCREEN_NAMES.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
  );
};
