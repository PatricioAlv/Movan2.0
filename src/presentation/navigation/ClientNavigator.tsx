import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ClientHomeScreen } from '@presentation/screens/client-stack/ClientHomeScreen';
import { CreateShipmentScreen } from '@presentation/screens/client-stack/CreateShipmentScreen';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';

const Stack = createStackNavigator();

export const ClientNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={SCREEN_NAMES.CLIENT_HOME} 
        component={ClientHomeScreen}
        options={{ title: 'Mis Envíos', headerShown: false }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.CREATE_SHIPMENT} 
        component={CreateShipmentScreen}
        options={{ title: 'Crear Envío' }}
      />
    </Stack.Navigator>
  );
};
