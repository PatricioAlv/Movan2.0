import React from 'react';
import { ClientHomeScreen } from '@presentation/screens/client-stack/ClientHomeScreen';
import { CreateShipmentScreen } from '@presentation/screens/client-stack/CreateShipmentScreen';
import { ClientShipmentDetailsScreen } from '@presentation/screens/client-stack/ClientShipmentDetailsScreen';
import { AccountSettingsStack } from '@presentation/navigation/AccountSettingsStack';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Home con detalles
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientHomeMain"
        component={ClientHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientShipmentDetails"
        component={ClientShipmentDetailsScreen}
        options={{
          title: 'Detalles del Envío',
          headerStyle: { 
            backgroundColor: '#0F172A',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

export function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          
          if (routeName === 'ClientShipmentDetails') {
            return { display: 'none' };
          }
          
          return {
            height: 60,
            paddingBottom: 6,
            backgroundColor: '#1E293B',
            borderTopColor: '#334155',
            borderTopWidth: 1,
          };
        })(route),
      })}
    >
      <Tab.Screen
        name={SCREEN_NAMES.CLIENT_HOME}
        component={HomeStack}
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