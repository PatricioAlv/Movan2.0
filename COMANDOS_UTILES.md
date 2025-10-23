# COMANDOS ÚTILES - MOVAN 2.0

## 📦 Instalación y Setup

```powershell
# Instalar dependencias
npm install

# Instalar Expo CLI globalmente
npm install -g expo-cli

# Limpiar caché y reinstalar
Remove-Item node_modules -Recurse -Force
npm install
```

## 🚀 Ejecutar la Aplicación

```powershell
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS (solo macOS)
npm run ios

# Iniciar con caché limpia
npx expo start -c

# Cambiar puerto
npx expo start --port 8081
```

## 🧪 Testing

```powershell
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar un test específico
npm test LoginUseCase.test.ts
```

## 🔍 Linting y Formateo

```powershell
# Ejecutar ESLint
npm run lint

# Arreglar problemas de ESLint automáticamente
npm run lint -- --fix

# Formatear código con Prettier
npx prettier --write "src/**/*.{ts,tsx}"
```

## 📱 Build y Deployment

```powershell
# Build para Android (APK)
npx expo build:android

# Build para Android (AAB - Google Play)
npx expo build:android -t app-bundle

# Usar EAS Build (recomendado)
npm install -g eas-cli
eas build --platform android

# Login en Expo
npx expo login

# Publicar actualización
npx expo publish
```

## 🔧 Utilidades

```powershell
# Ver estructura del proyecto
tree /F /A

# Limpiar caché de Metro
npx expo start -c

# Limpiar caché de npm
npm cache clean --force

# Verificar versión de Node
node --version

# Verificar versión de npm
npm --version

# Verificar versión de Expo
npx expo --version

# Actualizar Expo
npm install expo@latest

# Ver dispositivos Android conectados
adb devices

# Reiniciar servidor ADB
adb kill-server; adb start-server
```

## 🐛 Debugging

```powershell
# Ver logs en tiempo real
npx expo start

# Abrir DevTools
# Presiona 'j' en la terminal después de npm start

# Ver logs de Android
adb logcat

# Limpiar build de Android
cd android; .\gradlew clean; cd ..

# Resetear Metro Bundler
npx expo start -c
```

## 📊 Análisis de Bundle

```powershell
# Analizar tamaño del bundle
npx expo-bundle-analyzer

# Ver dependencias instaladas
npm list

# Ver dependencias de un paquete específico
npm list firebase

# Buscar paquetes desactualizados
npm outdated

# Actualizar paquetes (cuidado!)
npm update
```

## 🔐 Firebase

```powershell
# Instalar Firebase CLI
npm install -g firebase-tools

# Login en Firebase
firebase login

# Inicializar Firebase
firebase init

# Desplegar reglas de seguridad
firebase deploy --only database

# Ver logs de Firebase
firebase functions:log
```

## 📝 Git

```powershell
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit - Clean Architecture setup"

# Crear rama de desarrollo
git checkout -b develop

# Ver estado
git status

# Ver diferencias
git diff
```

## 🎨 Snippets Útiles

### Crear un nuevo caso de uso
```typescript
import { injectable, inject } from 'inversify';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class MiUseCase {
  constructor(
    @inject(TYPES.MiRepository) private repository: IMiRepository
  ) {}

  async execute(params: any): Promise<any> {
    // Lógica del caso de uso
  }
}
```

### Crear un nuevo screen
```typescript
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '@presentation/theme/colors';
import { spacing } from '@presentation/theme/spacing';

export const MiScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Mi Pantalla</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
});
```

## ⚡ Atajos de Desarrollo

```powershell
# Alias útiles (agregar a tu perfil de PowerShell)
# Edita: notepad $PROFILE

# Funciones útiles:
function expo-start { npx expo start -c }
function expo-android { npm run android }
function expo-test { npm test }
function expo-clean { 
  Remove-Item node_modules -Recurse -Force
  Remove-Item .expo -Recurse -Force -ErrorAction SilentlyContinue
  npm install
  npx expo start -c
}

# Después de guardar, recarga:
. $PROFILE
```

## 🆘 Solución Rápida de Problemas

```powershell
# Reset completo del proyecto
Remove-Item node_modules -Recurse -Force
Remove-Item .expo -Recurse -Force -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npx expo start -c

# Problemas con Android
adb kill-server
adb start-server
npx expo start -c

# Problemas con TypeScript
Remove-Item node_modules/@types -Recurse -Force
npm install

# Puerto ocupado
# Encuentra el proceso usando el puerto 19000
netstat -ano | findstr :19000
# Mata el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

## 📚 Documentación Rápida

```powershell
# Abrir documentación de Expo
start https://docs.expo.dev/

# Abrir Firebase Console
start https://console.firebase.google.com/

# Abrir React Navigation docs
start https://reactnavigation.org/docs/getting-started
```
