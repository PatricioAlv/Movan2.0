# 🚀 Guía de Migración a Firebase Cloud Functions

## 📋 Índice
1. [Prerequisitos](#prerequisitos)
2. [Fase 1: Configuración Inicial](#fase-1-configuración-inicial)
3. [Fase 2: Estructura del Backend](#fase-2-estructura-del-backend)
4. [Fase 3: Implementar Functions](#fase-3-implementar-functions)
5. [Fase 4: Migrar la App](#fase-4-migrar-la-app)
6. [Fase 5: Security Rules](#fase-5-security-rules)
7. [Fase 6: Testing y Deploy](#fase-6-testing-y-deploy)

---

## Prerequisitos

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Verificar proyecto Firebase
```bash
firebase projects:list
```

---

## Fase 1: Configuración Inicial

### 1.1 Inicializar Firebase Functions
```bash
cd c:\Proyectos\Movan2.0
firebase init functions
```

**Selecciona:**
- ✅ Use an existing project → `movan-857e9`
- ✅ TypeScript
- ✅ ESLint (recomendado)
- ✅ Install dependencies now

### 1.2 Estructura generada
```
Movan2.0/
├── functions/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.js
├── firebase.json
└── .firebaserc
```

### 1.3 Instalar dependencias adicionales
```bash
cd functions
npm install firebase-admin
npm install --save-dev @types/node
```

---

## Fase 2: Estructura del Backend

### 2.1 Crear estructura de carpetas
```bash
cd functions/src
mkdir auth shipments users ratings utils middleware
```

### 2.2 Estructura final
```
functions/
└── src/
    ├── index.ts                    # Exporta todas las functions
    ├── auth/
    │   ├── register.ts             # Registro de usuarios
    │   ├── login.ts                # Login (si necesitas lógica custom)
    │   └── updateProfile.ts        # Actualizar perfil
    ├── shipments/
    │   ├── createShipment.ts       # Crear envío
    │   ├── acceptShipment.ts       # Aceptar envío
    │   ├── cancelShipment.ts       # Cancelar envío
    │   ├── updateStatus.ts         # Actualizar estado
    │   └── getAvailableShipments.ts # Listar envíos disponibles
    ├── users/
    │   ├── getUserProfile.ts       # Obtener perfil
    │   ├── updateLocation.ts       # Actualizar ubicación
    │   └── updateRole.ts           # Cambiar rol
    ├── ratings/
    │   ├── createRating.ts         # Crear calificación
    │   ├── getRatings.ts           # Obtener calificaciones
    │   └── getAverageRating.ts     # Promedio de calificaciones
    ├── utils/
    │   ├── validation.ts           # Validaciones comunes
    │   ├── errors.ts               # Manejo de errores
    │   └── pricing.ts              # Cálculo de precios
    └── middleware/
        ├── auth.ts                 # Verificar autenticación
        └── roles.ts                # Verificar roles
```

---

## Fase 3: Implementar Functions

### 3.1 Configurar Admin SDK (`functions/src/index.ts`)
```typescript
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Inicializar Admin SDK
admin.initializeApp();

// Exportar functions
export { register } from './auth/register';
export { createShipment } from './shipments/createShipment';
export { acceptShipment } from './shipments/acceptShipment';
export { cancelShipment } from './shipments/cancelShipment';
export { createRating } from './ratings/createRating';
export { getUserProfile } from './users/getUserProfile';

// Triggers
export { onShipmentCreated } from './shipments/triggers';
export { onUserCreated } from './auth/triggers';
```

### 3.2 Utilidades de validación (`functions/src/utils/validation.ts`)
```typescript
import * as functions from 'firebase-functions';

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new functions.https.HttpsError('invalid-argument', 'Email inválido');
  }
};

export const validatePassword = (password: string): void => {
  if (!password || password.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'La contraseña debe tener al menos 6 caracteres'
    );
  }
};

export const validateRole = (role: string): void => {
  if (!['client', 'driver'].includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Rol inválido');
  }
};

export const validateRequired = (fields: Record<string, any>): void => {
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `El campo ${key} es requerido`
      );
    }
  }
};
```

### 3.3 Middleware de autenticación (`functions/src/middleware/auth.ts`)
```typescript
import * as functions from 'firebase-functions';

export const requireAuth = (context: functions.https.CallableContext): string => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debes iniciar sesión para realizar esta acción'
    );
  }
  return context.auth.uid;
};

export const requireRole = (
  context: functions.https.CallableContext,
  requiredRole: string
): void => {
  requireAuth(context);
  
  const userRole = context.auth?.token.role;
  if (userRole !== requiredRole) {
    throw new functions.https.HttpsError(
      'permission-denied',
      `Esta acción requiere rol de ${requiredRole}`
    );
  }
};
```

### 3.4 Function: Registro (`functions/src/auth/register.ts`)
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { validateEmail, validatePassword, validateRole, validateRequired } from '../utils/validation';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'client' | 'driver';
}

export const register = functions.https.onCall(async (data: RegisterData, context) => {
  const { email, password, name, role } = data;

  // Validaciones
  validateRequired({ email, password, name, role });
  validateEmail(email);
  validatePassword(password);
  validateRole(role);

  if (name.length < 2) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'El nombre debe tener al menos 2 caracteres'
    );
  }

  try {
    // Crear usuario en Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Crear perfil en Realtime Database
    const userData = {
      id: userRecord.uid,
      email,
      name,
      role,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    };

    await admin.database().ref(`users/${userRecord.uid}`).set(userData);

    // Asignar custom claims para roles
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    functions.logger.info(`Usuario registrado: ${userRecord.uid}`, { email, role });

    return {
      success: true,
      userId: userRecord.uid,
      message: 'Usuario registrado exitosamente',
    };
  } catch (error: any) {
    functions.logger.error('Error en registro:', error);
    
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'Este email ya está registrado'
      );
    }
    
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### 3.5 Function: Crear Envío (`functions/src/shipments/createShipment.ts`)
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequired } from '../utils/validation';

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

interface CreateShipmentData {
  cargoType: string;
  weight: number;
  price: number;
  origin: Location;
  destination: Location;
  description?: string;
}

export const createShipment = functions.https.onCall(
  async (data: CreateShipmentData, context) => {
    // Verificar autenticación y rol
    const userId = requireAuth(context);
    requireRole(context, 'client');

    const { cargoType, weight, price, origin, destination, description } = data;

    // Validaciones
    validateRequired({ cargoType, weight, price, origin, destination });

    if (weight <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'El peso debe ser mayor a 0');
    }

    if (price <= 0) {
      throw new functions.https.HttpsError('invalid-argument', 'El precio debe ser mayor a 0');
    }

    if (!origin.address || !origin.latitude || !origin.longitude) {
      throw new functions.https.HttpsError('invalid-argument', 'Datos de origen incompletos');
    }

    if (!destination.address || !destination.latitude || !destination.longitude) {
      throw new functions.https.HttpsError('invalid-argument', 'Datos de destino incompletos');
    }

    try {
      const shipmentRef = admin.database().ref('shipments').push();
      const shipmentId = shipmentRef.key!;

      const shipmentData = {
        id: shipmentId,
        clientId: userId,
        cargoType,
        weight,
        price,
        origin,
        destination,
        description: description || '',
        status: 'pending',
        createdAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
      };

      await shipmentRef.set(shipmentData);

      functions.logger.info(`Envío creado: ${shipmentId}`, { userId, cargoType });

      return {
        success: true,
        shipmentId,
        message: 'Envío creado exitosamente',
      };
    } catch (error: any) {
      functions.logger.error('Error al crear envío:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
```

### 3.6 Function: Aceptar Envío (`functions/src/shipments/acceptShipment.ts`)
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequired } from '../utils/validation';

interface AcceptShipmentData {
  shipmentId: string;
}

export const acceptShipment = functions.https.onCall(
  async (data: AcceptShipmentData, context) => {
    const driverId = requireAuth(context);
    requireRole(context, 'driver');

    const { shipmentId } = data;
    validateRequired({ shipmentId });

    try {
      const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
      const snapshot = await shipmentRef.once('value');

      if (!snapshot.exists()) {
        throw new functions.https.HttpsError('not-found', 'Envío no encontrado');
      }

      const shipment = snapshot.val();

      if (shipment.status !== 'pending') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Este envío ya no está disponible'
        );
      }

      // Actualizar envío
      await shipmentRef.update({
        driverId,
        status: 'accepted',
        acceptedAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
      });

      functions.logger.info(`Envío aceptado: ${shipmentId}`, { driverId });

      return {
        success: true,
        message: 'Envío aceptado exitosamente',
      };
    } catch (error: any) {
      functions.logger.error('Error al aceptar envío:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
```

### 3.7 Function: Cancelar Envío (`functions/src/shipments/cancelShipment.ts`)
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth } from '../middleware/auth';
import { validateRequired } from '../utils/validation';

interface CancelShipmentData {
  shipmentId: string;
  reason?: string;
}

export const cancelShipment = functions.https.onCall(
  async (data: CancelShipmentData, context) => {
    const userId = requireAuth(context);
    const { shipmentId, reason } = data;
    validateRequired({ shipmentId });

    try {
      const shipmentRef = admin.database().ref(`shipments/${shipmentId}`);
      const snapshot = await shipmentRef.once('value');

      if (!snapshot.exists()) {
        throw new functions.https.HttpsError('not-found', 'Envío no encontrado');
      }

      const shipment = snapshot.val();
      const userRole = context.auth?.token.role;

      // Verificar permisos
      if (userRole === 'client' && shipment.clientId !== userId) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'No tienes permiso para cancelar este envío'
        );
      }

      if (userRole === 'driver' && shipment.driverId !== userId) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'No tienes permiso para cancelar este envío'
        );
      }

      if (['completed', 'cancelled'].includes(shipment.status)) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Este envío no puede ser cancelado'
        );
      }

      // Cancelar envío
      await shipmentRef.update({
        status: 'cancelled',
        cancelledBy: userId,
        cancelReason: reason || '',
        cancelledAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
      });

      functions.logger.info(`Envío cancelado: ${shipmentId}`, { userId, reason });

      return {
        success: true,
        message: 'Envío cancelado exitosamente',
      };
    } catch (error: any) {
      functions.logger.error('Error al cancelar envío:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
```

### 3.8 Function: Crear Calificación (`functions/src/ratings/createRating.ts`)
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { requireAuth } from '../middleware/auth';
import { validateRequired } from '../utils/validation';

interface CreateRatingData {
  shipmentId: string;
  rating: number;
  comment?: string;
}

export const createRating = functions.https.onCall(
  async (data: CreateRatingData, context) => {
    const userId = requireAuth(context);
    const { shipmentId, rating, comment } = data;

    validateRequired({ shipmentId, rating });

    if (rating < 1 || rating > 5) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'La calificación debe estar entre 1 y 5'
      );
    }

    try {
      // Verificar que el envío existe y está completado
      const shipmentSnapshot = await admin
        .database()
        .ref(`shipments/${shipmentId}`)
        .once('value');

      if (!shipmentSnapshot.exists()) {
        throw new functions.https.HttpsError('not-found', 'Envío no encontrado');
      }

      const shipment = shipmentSnapshot.val();

      if (shipment.status !== 'completed') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Solo puedes calificar envíos completados'
        );
      }

      // Verificar que el usuario participó en el envío
      if (shipment.clientId !== userId && shipment.driverId !== userId) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'No participaste en este envío'
        );
      }

      // Determinar quién califica a quién
      const ratedUserId = shipment.clientId === userId 
        ? shipment.driverId 
        : shipment.clientId;

      // Verificar que no haya calificado antes
      const existingRating = await admin
        .database()
        .ref('ratings')
        .orderByChild('shipmentId')
        .equalTo(shipmentId)
        .once('value');

      if (existingRating.exists()) {
        const ratings = existingRating.val();
        const alreadyRated = Object.values(ratings).some(
          (r: any) => r.reviewerId === userId
        );

        if (alreadyRated) {
          throw new functions.https.HttpsError(
            'already-exists',
            'Ya calificaste este envío'
          );
        }
      }

      // Crear calificación
      const ratingRef = admin.database().ref('ratings').push();
      const ratingData = {
        id: ratingRef.key,
        shipmentId,
        reviewerId: userId,
        reviewedUserId: ratedUserId,
        rating,
        comment: comment || '',
        createdAt: admin.database.ServerValue.TIMESTAMP,
      };

      await ratingRef.set(ratingData);

      // Actualizar promedio del usuario calificado
      await updateUserAverageRating(ratedUserId);

      functions.logger.info(`Calificación creada`, { shipmentId, rating });

      return {
        success: true,
        ratingId: ratingRef.key,
        message: 'Calificación registrada exitosamente',
      };
    } catch (error: any) {
      functions.logger.error('Error al crear calificación:', error);
      
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);

async function updateUserAverageRating(userId: string): Promise<void> {
  const ratingsSnapshot = await admin
    .database()
    .ref('ratings')
    .orderByChild('reviewedUserId')
    .equalTo(userId)
    .once('value');

  if (!ratingsSnapshot.exists()) return;

  const ratings = Object.values(ratingsSnapshot.val()) as any[];
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  const average = sum / ratings.length;

  await admin.database().ref(`users/${userId}`).update({
    averageRating: Number(average.toFixed(2)),
    totalRatings: ratings.length,
  });
}
```

### 3.9 Trigger: Notificar conductores (`functions/src/shipments/triggers.ts`)
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onShipmentCreated = functions.database
  .ref('/shipments/{shipmentId}')
  .onCreate(async (snapshot, context) => {
    const shipment = snapshot.val();
    const shipmentId = context.params.shipmentId;

    functions.logger.info(`Nuevo envío creado: ${shipmentId}`);

    try {
      // Obtener todos los conductores
      const driversSnapshot = await admin
        .database()
        .ref('users')
        .orderByChild('role')
        .equalTo('driver')
        .once('value');

      if (!driversSnapshot.exists()) {
        functions.logger.info('No hay conductores registrados');
        return;
      }

      const drivers = driversSnapshot.val();
      const tokens: string[] = [];

      // Recopilar tokens FCM
      Object.values(drivers).forEach((driver: any) => {
        if (driver.fcmToken) {
          tokens.push(driver.fcmToken);
        }
      });

      if (tokens.length === 0) {
        functions.logger.info('No hay tokens FCM disponibles');
        return;
      }

      // Enviar notificación
      const message = {
        notification: {
          title: '🚚 Nuevo envío disponible',
          body: `${shipment.cargoType} - $${shipment.price}`,
        },
        data: {
          type: 'new_shipment',
          shipmentId,
          cargoType: shipment.cargoType,
          price: shipment.price.toString(),
        },
        tokens,
      };

      const response = await admin.messaging().sendMulticast(message);
      
      functions.logger.info(`Notificaciones enviadas: ${response.successCount}/${tokens.length}`);
    } catch (error) {
      functions.logger.error('Error al enviar notificaciones:', error);
    }
  });
```

---

## Fase 4: Migrar la App

### 4.1 Crear DataSource para Cloud Functions (`src/data/datasources/remote/CloudFunctionsDataSource.ts`)
```typescript
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { injectable } from 'inversify';

@injectable()
export class CloudFunctionsDataSource {
  private functions = getFunctions();

  private async callFunction<T, R>(
    functionName: string,
    data?: T
  ): Promise<R> {
    try {
      const callable = httpsCallable<T, R>(this.functions, functionName);
      const result: HttpsCallableResult<R> = await callable(data);
      return result.data;
    } catch (error: any) {
      // Manejar errores de Cloud Functions
      throw new Error(error.message || 'Error al llamar a Cloud Function');
    }
  }

  // Auth
  async register(email: string, password: string, name: string, role: string) {
    return this.callFunction('register', { email, password, name, role });
  }

  // Shipments
  async createShipment(shipmentData: any) {
    return this.callFunction('createShipment', shipmentData);
  }

  async acceptShipment(shipmentId: string) {
    return this.callFunction('acceptShipment', { shipmentId });
  }

  async cancelShipment(shipmentId: string, reason?: string) {
    return this.callFunction('cancelShipment', { shipmentId, reason });
  }

  // Ratings
  async createRating(shipmentId: string, rating: number, comment?: string) {
    return this.callFunction('createRating', { shipmentId, rating, comment });
  }
}
```

### 4.2 Actualizar Repository (`src/data/repositories/FirebaseAuthRepository.ts`)
```typescript
import { injectable, inject } from 'inversify';
import { IAuthRepository } from '@core/repositories/IAuthRepository';
import { User } from '@core/entities/User';
import { CloudFunctionsDataSource } from '@data/datasources/remote/CloudFunctionsDataSource';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';
import { UserMapper } from '@data/models/mappers/UserMapper';
import { UserModel } from '@data/models/UserModel';
import { TYPES } from '@infrastructure/di/types';

@injectable()
export class FirebaseAuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.CloudFunctionsDataSource)
    private cloudFunctionsDataSource: CloudFunctionsDataSource,
    @inject(TYPES.FirebaseRealtimeDataSource)
    private realtimeDataSource: FirebaseRealtimeDataSource
  ) {}

  async register(email: string, password: string, name: string): Promise<User> {
    // Llamar a Cloud Function
    const result: any = await this.cloudFunctionsDataSource.register(
      email,
      password,
      name,
      'client'
    );

    // Obtener datos del usuario
    const userModel = await this.realtimeDataSource.getData<UserModel>(
      `users/${result.userId}`
    );

    return UserMapper.toDomain(userModel);
  }

  // ... otros métodos
}
```

### 4.3 Registrar en Container DI (`src/infrastructure/di/container.ts`)
```typescript
import { Container } from 'inversify';
import { TYPES } from './types';

// DataSources
import { CloudFunctionsDataSource } from '@data/datasources/remote/CloudFunctionsDataSource';
import { FirebaseRealtimeDataSource } from '@data/datasources/remote/FirebaseRealtimeDataSource';

const container = new Container();

// Registrar Cloud Functions DataSource
container.bind(TYPES.CloudFunctionsDataSource).to(CloudFunctionsDataSource);

// ... resto de registros

export { container };
```

### 4.4 Actualizar types (`src/infrastructure/di/types.ts`)
```typescript
export const TYPES = {
  // DataSources
  CloudFunctionsDataSource: Symbol.for('CloudFunctionsDataSource'),
  FirebaseRealtimeDataSource: Symbol.for('FirebaseRealtimeDataSource'),
  // ... resto
};
```

---

## Fase 5: Security Rules

### 5.1 Actualizar Realtime Database Rules (`database.rules.json`)
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || auth.token.role === 'admin')",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "shipments": {
      "$shipmentId": {
        ".read": "auth != null",
        ".write": false
      }
    },
    "ratings": {
      "$ratingId": {
        ".read": "auth != null",
        ".write": false
      }
    }
  }
}
```

**Importante:** Las escrituras ahora solo se permiten desde Cloud Functions.

---

## Fase 6: Testing y Deploy

### 6.1 Probar localmente
```bash
cd functions
npm run build
firebase emulators:start
```

### 6.2 Probar Functions en el emulador
```typescript
// En tu app, usa el emulador
import { connectFunctionsEmulator } from 'firebase/functions';
import { functions } from '@data/config/firebase.config';

if (__DEV__) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

### 6.3 Deploy a producción
```bash
# Deploy solo functions
firebase deploy --only functions

# Deploy functions y rules
firebase deploy --only functions,database

# Deploy todo
firebase deploy
```

### 6.4 Verificar deploy
```bash
firebase functions:log
```

---

## 🎯 Checklist de Migración

### Configuración
- [ ] Firebase CLI instalado
- [ ] Proyecto Firebase configurado
- [ ] Functions inicializadas
- [ ] Dependencias instaladas

### Backend (Cloud Functions)
- [ ] Estructura de carpetas creada
- [ ] Utils y middleware implementados
- [ ] Function: register
- [ ] Function: createShipment
- [ ] Function: acceptShipment
- [ ] Function: cancelShipment
- [ ] Function: createRating
- [ ] Trigger: onShipmentCreated
- [ ] Functions testeadas localmente

### App Móvil
- [ ] CloudFunctionsDataSource creado
- [ ] Repositories actualizados
- [ ] DI Container configurado
- [ ] Llamadas a Firebase Auth removidas
- [ ] Llamadas directas a Database removidas
- [ ] Emulador configurado para desarrollo

### Seguridad
- [ ] Security Rules actualizadas
- [ ] Custom Claims implementados
- [ ] Validaciones del servidor funcionando
- [ ] Permisos por rol verificados

### Deploy
- [ ] Functions desplegadas
- [ ] Rules desplegadas
- [ ] App testeada en producción
- [ ] Logs monitoreados
- [ ] Errores resueltos

---

## 📊 Monitoreo

### Ver logs en tiempo real
```bash
firebase functions:log --only register,createShipment
```

### Consola de Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `movan-857e9`
3. Functions → Ver logs y métricas

---

## ⚠️ Troubleshooting

### Error: "Function not found"
```bash
# Verificar que la función está desplegada
firebase functions:list

# Re-desplegar
firebase deploy --only functions
```

### Error: "CORS"
```typescript
// En functions, habilitar CORS si es necesario
import * as cors from 'cors';
const corsHandler = cors({ origin: true });
```

### Error: "Permission denied"
```bash
# Verificar Security Rules
firebase database:get /

# Actualizar rules
firebase deploy --only database
```

---

## 💰 Costos Estimados

### Plan Spark (Gratis)
- ✅ 2M invocaciones/mes
- ✅ 400K GB-seg
- ✅ 200K CPU-seg

### Plan Blaze (Pay as you go)
- $0.40 por millón de invocaciones
- $0.0000025 por GB-segundo
- $0.0000100 por GHz-segundo

**Para una app pequeña/mediana: Plan Spark es suficiente** 🎉

---

## 📚 Recursos

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Security Rules Guide](https://firebase.google.com/docs/database/security)
- [Cloud Functions Pricing](https://firebase.google.com/pricing)
- [Best Practices](https://firebase.google.com/docs/functions/best-practices)

---

**¡Listo para migrar! 🚀**
