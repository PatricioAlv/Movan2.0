import React from 'react';
import { TransHomeScreen } from '@presentation/screens/transportist-stack/TransHomeScreen';
import { TransportistBrowserScreen } from '@presentation/screens/transportist-stack/TransShipmentBrowser';
import { TransShipmentDetailsScreen } from '@presentation/screens/transportist-stack/TransShipmentDetailsScreen';
import { ActiveShipmentScreen } from '@presentation/screens/transportist-stack/ActiveShipmentScreen';
import { MyShipmentDetailsScreen } from '@presentation/screens/transportist-stack/MyShipmentDetailsScreen';
import { AccountSettingsStack } from '@presentation/navigation/AccountSettingsStack';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para la pantalla Home (Mis Envíos), Detalles y Envío Activo
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={TransHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyShipmentDetails"
        component={MyShipmentDetailsScreen}
        options={{
          title: 'Detalles del Envío',
          headerStyle: { backgroundColor: '#253546ff' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="ActiveShipment"
        component={ActiveShipmentScreen}
        options={{
          title: 'Envío Activo',
          headerStyle: { backgroundColor: '#253546ff' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#262E93',
        tabBarStyle: ((route) => {
          // Ocultar la barra de tabs cuando estamos en ActiveShipment o MyShipmentDetails
          const routeName = route.state 
            ? route.state.routes[route.state.index].name 
            : route.name;
          
          if (routeName === 'ActiveShipment' || routeName === 'MyShipmentDetails') {
            return { display: 'none' };
          }
          
          return {
            height: 60,
            paddingBottom: 6,
          };
        })(route),
      })}
    >
      <Tab.Screen
        name={SCREEN_NAMES.TRANS_HOME}
        component={HomeStack}
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