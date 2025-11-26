import React from 'react';
import { ClientHomeScreen } from '@presentation/screens/client-stack/ClientHomeScreen';
import { CreateShipmentScreen } from '@presentation/screens/client-stack/CreateShipmentScreen';
import { AccountSettingsStack } from '@presentation/navigation/AccountSettingsStack';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#262E93',
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
        },
      }}
    >
      <Tab.Screen
        name={SCREEN_NAMES.CLIENT_HOME}
        component={ClientHomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={26} color={color} />
          ),
          tabBarLabel: 'Inicio',
        }}
      />

      <Tab.Screen
        name={SCREEN_NAMES.CREATE_SHIPMENT}
        component={CreateShipmentScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-circle" size={26} color={color} />
          ),
          tabBarLabel: 'Crear',
        }}
      />

      <Tab.Screen
        name={SCREEN_NAMES.ACCOUNT_SETTINGS}
        component={AccountSettingsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cog" size={26} color={color} />
          ),
          tabBarLabel: 'Configuración',
        }}
      />

    </Tab.Navigator>
  );
}