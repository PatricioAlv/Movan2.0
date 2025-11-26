import React from 'react';
import { TransHomeScreen } from '@presentation/screens/transportist-stack/TransHomeScreen';
import { TransportistBrowserScreen } from '@presentation/screens/transportist-stack/TransShipmentBrowser';
import { TransShipmentDetailsScreen } from '@presentation/screens/transportist-stack/TransShipmentDetailsScreen';
import { AccountSettingsStack } from '@presentation/navigation/AccountSettingsStack';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para la pantalla de búsqueda y detalles
function BrowserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BrowserMain"
        component={TransportistBrowserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransportistShipmentDetails"
        component={TransShipmentDetailsScreen}
        options={{
          title: 'Detalles del Pedido',
          headerStyle: { backgroundColor: '#253546ff' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

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
        component={BrowserStack}
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