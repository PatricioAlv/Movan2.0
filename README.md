# 🚚 Movan 2.0

Aplicación móvil de logística y transporte construida con React Native y Expo, con backend en Firebase Cloud Functions. Conecta clientes que necesitan envíos con transportistas disponibles.

## ✅ Estado del Proyecto

- ✅ **Arquitectura Clean implementada**
- ✅ **Backend API REST con 22 endpoints**
- ✅ **Sistema de autenticación completo**
- ✅ **Gestión de envíos (shipments)**
- ✅ **Sistema de calificaciones (ratings)**
- ✅ **Perfiles de usuario (cliente/transportista)**
- ✅ **Navegación dual (cliente/transportista)**
- ✅ **Firebase Cloud Functions**
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

Este proyecto está dividido en **Frontend** (React Native) y **Backend** (Firebase Cloud Functions):

### Frontend (React Native + Expo)
- **Presentation**: UI, screens, componentes, navegación y hooks
- **Core**: Entidades (User, Order, Rating) e interfaces
- **Infrastructure**: Utilidades y constantes

### Backend (Firebase Cloud Functions)
- **Routes**: Definición de endpoints Express.js
- **Controllers**: Manejo de requests/responses HTTP
- **UseCases**: Lógica de negocio
- **Firebase Admin**: Acceso a Realtime Database y Auth

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

### 3. Configurar variables de entorno

Crea el archivo `.env` en la raíz del proyecto:

```env
LOCAL_IP=TU_IP_LOCAL
```

### 4. Ejecutar la aplicación

```bash
# Iniciar servidor de desarrollo (Frontend)
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

### 5. Ejecutar el Backend (Cloud Functions)

```bash
# Entrar a la carpeta de functions
cd functions

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Iniciar emulador de Firebase
npm run serve
```

## 🔌 API REST - Endpoints (22 total)

### 🔐 Auth (2)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/register` | Registrar usuario |
| POST | `/login` | Iniciar sesión |

### 👤 Users (5)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/users/:userId` | Obtener usuario por ID |
| PUT | `/users/:userId` | Actualizar perfil |
| DELETE | `/users/:userId` | Desactivar cuenta |
| GET | `/users/role/:role` | Listar por rol |
| PUT | `/users/:userId/password` | Cambiar contraseña |

### 📦 Shipments (10)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/shipments` | Crear envío |
| GET | `/shipments/available` | Envíos disponibles |
| GET | `/shipments/client/:clientId` | Envíos del cliente |
| GET | `/shipments/driver/:driverId` | Envíos del transportista |
| GET | `/shipments/:shipmentId` | Obtener envío por ID |
| POST | `/shipments/cancel` | Cancelar envío |
| POST | `/shipments/updateStatus` | Actualizar estado |
| POST | `/shipments/startPickup` | Iniciar viaje |
| POST | `/shipments/confirmDelivery` | Confirmar entrega |
| POST | `/shipments/accept` | Aceptar envío |

### ⭐ Ratings (6)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/ratings` | Crear calificación |
| GET | `/ratings/user/:userId` | Calificaciones de usuario |
| GET | `/ratings/average/:userId` | Promedio de calificación |
| GET | `/ratings/check/:shipmentId/:userId` | Verificar si calificó |
| GET | `/ratings/shipment/:shipmentId` | Calificaciones de envío |
| DELETE | `/ratings/:ratingId` | Eliminar calificación |

## 📱 Estructura del Proyecto

```
Movan2.0/
├── src/                         # Frontend (React Native)
│   ├── core/                    # Entidades e interfaces
│   │   └── entities/            # User, Order, Rating
│   ├── data/                    # Configuración Firebase
│   │   └── config/              # firebase.config.ts
│   ├── presentation/            # UI y componentes
│   │   ├── screens/
│   │   │   ├── auth/            # Login, Register
│   │   │   ├── client-stack/    # Pantallas del cliente
│   │   │   ├── transportist-stack/  # Pantallas transportista
│   │   │   └── shared/          # Perfil, Settings
│   │   ├── navigation/          # Navegadores
│   │   ├── components/common/   # Componentes reutilizables
│   │   ├── hooks/               # Custom hooks
│   │   └── theme/               # Estilos, colores
│   └── infrastructure/          # Utilidades
│       └── utils/               # Validators, formatters
│
├── functions/                   # Backend (Cloud Functions)
│   └── src/
│       ├── index.ts             # Entry point
│       ├── routes/              # Express routes
│       │   └── index.ts         # Definición de endpoints
│       ├── controllers/         # Request handlers
│       │   ├── authController.ts
│       │   ├── userController.ts
│       │   ├── shipmentsController.ts
│       │   └── ratingsController.ts
│       └── usecases/            # Lógica de negocio
│           ├── authUseCases/
│           ├── userUseCases/
│           ├── shipmentUseCases/
│           └── ratingUseCases/
│
├── __tests__/                   # Tests unitarios
├── assets/                      # Recursos estáticos
├── .env                         # Variables de entorno
├── app.config.js                # Configuración Expo
└── package.json                 # Dependencias frontend
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

### Frontend
| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | React Native | 0.74.5 |
| **Plataforma** | Expo | ~51.0.0 |
| **Lenguaje** | TypeScript | ~5.3.3 |
| **Navegación** | React Navigation | ^6.1.9 |
| **Storage** | AsyncStorage | 1.23.1 |
| **Maps** | React Native Maps | 1.14.0 |
| **Testing** | Jest | ^29.7.0 |

### Backend
| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Runtime** | Node.js | 20 |
| **Framework** | Express.js | ^4.18.2 |
| **Cloud** | Firebase Functions | ^4.3.1 |
| **Database** | Firebase Realtime DB | - |
| **Auth** | Firebase Admin | ^11.8.0 |
| **Lenguaje** | TypeScript | ~5.3.3 |

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
