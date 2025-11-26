import React from 'react';
import { TransHomeScreen } from '@presentation/screens/transportist-stack/TransHomeScreen';
import { TransportistBrowserScreen } from '@presentation/screens/transportist-stack/TransShipmentBrowser';
import { AccountSettingsStack } from '@presentation/navigation/AccountSettingsStack';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

export function TransportistNavigator() {
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
        name={SCREEN_NAMES.TRANS_HOME}
        component={TransHomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={26} color={color} />
          ),
          tabBarLabel: 'Inicio',
        }}
      />

      <Tab.Screen
        name={SCREEN_NAMES.TRANS_BROWSER}
        component={TransportistBrowserScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={26} color={color} />
          ),
          tabBarLabel: 'Buscar',
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