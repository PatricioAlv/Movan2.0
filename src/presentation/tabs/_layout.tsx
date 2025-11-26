import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';

const Tab = createBottomTabNavigator();

export default function TabLayout(){
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#262E93',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={() => null}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Cuenta"
        component={() => null}
        options={{
          title: 'Cuenta',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Buscar"
        component={() => null}
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Opciones"
        component={() => null}
        options={{
          title: 'Opciones',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}