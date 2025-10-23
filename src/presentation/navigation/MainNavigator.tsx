import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductListScreen } from '@presentation/screens/products/ProductListScreen';
import { SCREEN_NAMES } from '@infrastructure/utils/constants';

const Stack = createStackNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={SCREEN_NAMES.PRODUCT_LIST} 
        component={ProductListScreen}
        options={{ title: 'Productos' }}
      />
    </Stack.Navigator>
  );
};
