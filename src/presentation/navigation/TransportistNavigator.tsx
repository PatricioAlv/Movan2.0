import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TransHomeScreen } from '@presentation/screens/transportist-stack/TransHomeScreen';
import { TransportistBrowserScreen } from '@presentation/screens/transportist-stack/TransShipmentBrowser';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';

const Stack = createStackNavigator();

export const TransportistNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={SCREEN_NAMES.TRANS_HOME} 
        component={TransHomeScreen}
        options={{ title: 'Mis Pedidos', headerShown: false }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.TRANS_BROWSER} 
        component={TransportistBrowserScreen}
        options={{ title: 'Buscar pedidos', headerShown: false  }}
      />
    </Stack.Navigator>
  );
};
