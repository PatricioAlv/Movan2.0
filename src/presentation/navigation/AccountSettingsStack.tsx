import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountSettingsScreen } from '@presentation/screens/shared/AccountSettingsScreen';
import { ProfileDetailScreen } from '@presentation/screens/shared/ProfileDetailScreen';

const Stack = createStackNavigator();

export function AccountSettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="AccountSettingsMain"
        component={AccountSettingsScreen}
      />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
      />
    </Stack.Navigator>
  );
}
