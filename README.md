# 🚚 Movan 2.0

Aplicación móvil de logística y transporte construida con React Native y Expo, siguiendo Clean Architecture. Conecta clientes que necesitan envíos con transportistas disponibles.

## ✅ Estado del Proyecto

- ✅ **Arquitectura Clean implementada**
- ✅ **Sistema de autenticación completo**
- ✅ **Gestión de envíos (shipments)**
- ✅ **Sistema de calificaciones (ratings)**
- ✅ **Perfiles de usuario (cliente/transportista)**
- ✅ **Navegación dual (cliente/transportista)**
- ✅ **Firebase configurado**
- ✅ **Tests unitarios base**

## 🎯 Características Principales

### Para Clientes
- ✅ Crear solicitudes de envío
- ✅ Ver historial de envíos
- ✅ Seguimiento en tiempo real
- ✅ Calificar transportistas
- ✅ Gestión de perfil

### Para Transportistas
- ✅ Explorar envíos disponibles
- ✅ Aceptar/rechazar solicitudes
- ✅ Gestionar envíos activos
- ✅ Ver calificaciones recibidas
- ✅ Actualizar estado de entregas

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture** con 4 capas principales:

- **Core**: Entidades (User, Order, Rating), casos de uso e interfaces de repositorios
- **Data**: Implementaciones de repositorios Firebase, modelos y mappers
- **Presentation**: UI, screens, componentes, navegación y hooks
- **Infrastructure**: Inyección de dependencias (InversifyJS), utilidades y constantes

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa **Authentication** (Email/Password y Google)
3. Activa **Realtime Database**
4. Configura las reglas de seguridad:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

5. Descarga las credenciales de Firebase Web SDK
6. Crea el archivo `src/data/config/firebase.config.ts`:

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

# Ejecutar en iOS
npm run ios
```

## 📱 Estructura del Proyecto

```
src/
├── core/                      # Lógica de negocio pura
│   ├── entities/              # User, Order, Rating
│   ├── repositories/          # Interfaces
│   └── usecases/              # Casos de uso
│       ├── auth/              # Login, Register, Logout
│       ├── shipments/         # CRUD de envíos
│       ├── ratings/           # Sistema de calificaciones
│       └── user/              # Gestión de usuarios
│
├── data/                      # Implementaciones
│   ├── config/                # Firebase config
│   ├── datasources/           # Local (AsyncStorage) y Remote (Firebase)
│   ├── models/                # DTOs y Mappers
│   └── repositories/          # FirebaseAuthRepository, etc.
│
├── presentation/              # UI y componentes
│   ├── screens/
│   │   ├── auth/              # Login, Register
│   │   ├── client-stack/      # Pantallas del cliente
│   │   ├── transportist-stack/# Pantallas del transportista
│   │   └── shared/            # Perfil, Settings
│   ├── navigation/            # Navegadores
│   ├── components/common/     # Componentes reutilizables
│   ├── hooks/                 # useRating, etc.
│   └── theme/                 # Estilos, colores, tipografía
│
└── infrastructure/            # Servicios y utilidades
    ├── di/                    # Dependency Injection (InversifyJS)
    └── utils/                 # Validators, formatters, constants
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm test -- --watch
```

## 📦 Build

### Android

```bash
# Build de desarrollo
eas build --platform android --profile development

# Build de producción
eas build --platform android --profile production
```

### iOS

```bash
# Build de desarrollo
eas build --platform ios --profile development

# Build de producción
eas build --platform ios --profile production
```

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | React Native | 0.74.5 |
| **Plataforma** | Expo | ~51.0.0 |
| **Lenguaje** | TypeScript | ~5.3.3 |
| **Backend** | Firebase | ^10.14.1 |
| **Navegación** | React Navigation | ^6.1.9 |
| **DI** | InversifyJS | ^6.0.2 |
| **Storage** | AsyncStorage | 1.23.1 |
| **Maps** | React Native Maps | 1.14.0 |
| **Testing** | Jest | ^29.7.0 |

## 📖 Documentación Adicional

- [ESTRUCTURA_PROYECTO.md](./ESTRUCTURA_PROYECTO.md) - Estructura detallada del proyecto
- Ver [documentación de Expo](https://docs.expo.dev/)
- Ver [documentación de Firebase](https://firebase.google.com/docs)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

---

Desarrollado con ❤️ usando React Native y Clean Architecture
