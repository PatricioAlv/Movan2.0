# Movan 2.0

Aplicación móvil React Native con Expo, siguiendo Clean Architecture.

## ✅ Estado del Proyecto

- ✅ **Dependencias instaladas correctamente**
- ⏳ **Pendiente:** Configurar Firebase (ver instrucciones abajo)

## 🏗️ Arquitectura

Este proyecto sigue los principios de Clean Architecture con las siguientes capas:

- **Core**: Entidades, casos de uso e interfaces de repositorios
- **Data**: Implementaciones de repositorios, fuentes de datos y modelos
- **Presentation**: UI, screens, componentes, navegación y viewmodels
- **Infrastructure**: Servicios externos, inyección de dependencias y utilidades

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa Authentication y Realtime Database
3. Registra tu aplicación Android
4. Descarga `google-services.json` y colócalo en la carpeta raíz
5. Copia las credenciales de Firebase Web SDK
6. Crea el archivo `src/data/config/firebase.config.ts` con tus credenciales:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
```

### 3. Ejecutar la aplicación

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android
```

## 📱 Estructura del Proyecto

```
src/
├── core/               # Lógica de negocio pura
├── data/              # Implementaciones de datos
├── presentation/      # UI y componentes
└── infrastructure/    # Servicios y utilidades
```

## 🧪 Testing

```bash
npm test
```

## 📦 Build

Para generar un APK de producción, sigue la [documentación de Expo](https://docs.expo.dev/build/setup/).

```bash
eas build --platform android
```
