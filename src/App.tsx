import 'react-native-gesture-handler';
import 'reflect-metadata';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@presentation/navigation/AppNavigator';
// Importar el container para asegurar que se inicialice
import '@infrastructure/di/init';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
