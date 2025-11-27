# 🚀 Plan de Migración Backend + Nuevos Endpoints

## 📊 Estado Actual

**Endpoints existentes (19)** que funcionan con Realtime Database directo:
- ✅ Auth: 4 endpoints
- ✅ Usuarios: 2 endpoints  
- ✅ Envíos: 8 endpoints
- ✅ Calificaciones: 5 endpoints

---

## 🔄 FASE 1: Migrar Endpoints Existentes a Cloud Functions

### 🔐 **Auth Functions (4)**

#### 1. `register`
```typescript
// Cloud Function
functions.https.onCall(async (data: {email, password, name, role}) => {
  // Validaciones del servidor
  // Crear usuario en Auth
  // Guardar en Database
  // Asignar custom claims (role)
})
```

#### 2. `login` (opcional - Firebase Auth lo maneja)
```typescript
// Solo si necesitas lógica custom (ej: registrar último login)
functions.https.onCall(async (data: {email, password}) => {
  // Actualizar lastLoginAt
})
```

#### 3. `logout` (opcional)
```typescript
// Solo si necesitas lógica custom
functions.https.onCall(async (data) => {
  // Registrar logout en logs
})
```

#### 4. `getCurrentUser`
```typescript
functions.https.onCall(async (data, context) => {
  const userId = requireAuth(context);
  const user = await admin.database().ref(`users/${userId}`).once('value');
  return user.val();
})
```

---

### 👤 **User Functions (2)**

#### 5. `getUserById`
```typescript
functions.https.onCall(async (data: {userId: string}, context) => {
  requireAuth(context);
  const user = await admin.database().ref(`users/${data.userId}`).once('value');
  return user.val();
})
```

#### 6. `updateUser`
```typescript
functions.https.onCall(async (data: {name, phone, etc}, context) => {
  const userId = requireAuth(context);
  await admin.database().ref(`users/${userId}`).update(data);
})
```

---

### 📦 **Shipment Functions (8)**

#### 7. `createShipment`
```typescript
functions.https.onCall(async (data: ShipmentData, context) => {
  const userId = requireAuth(context);
  requireRole(context, 'client');
  // Validaciones del servidor
  // Crear envío
  // Trigger notificaciones
})
```

#### 8. `acceptShipment`
```typescript
functions.https.onCall(async (data: {shipmentId}, context) => {
  const userId = requireAuth(context);
  requireRole(context, 'driver');
  // Verificar disponibilidad
  // Asignar conductor
})
```

#### 9. `cancelShipment`
```typescript
functions.https.onCall(async (data: {shipmentId, reason}, context) => {
  const userId = requireAuth(context);
  // Verificar permisos
  // Cancelar
  // Notificar a la otra parte
})
```

#### 10. `updateShipmentStatus`
```typescript
functions.https.onCall(async (data: {shipmentId, status}, context) => {
  const userId = requireAuth(context);
  // Validar transición de estado
  // Actualizar
  // Notificar cliente
})
```

#### 11. `getShipmentById`
```typescript
functions.https.onCall(async (data: {shipmentId}, context) => {
  requireAuth(context);
  return await getShipment(data.shipmentId);
})
```

#### 12. `getClientShipments`
```typescript
functions.https.onCall(async (data: {status?}, context) => {
  const userId = requireAuth(context);
  // Obtener envíos del cliente con filtros
})
```

#### 13. `getDriverShipments`
```typescript
functions.https.onCall(async (data: {status?}, context) => {
  const userId = requireAuth(context);
  requireRole(context, 'driver');
  // Obtener envíos del conductor
})
```

#### 14. `getAvailableShipments`
```typescript
functions.https.onCall(async (data: {latitude?, longitude?, radius?}, context) => {
  requireAuth(context);
  requireRole(context, 'driver');
  // Obtener envíos disponibles cerca del conductor
})
```

---

### ⭐ **Rating Functions (5)**

#### 15. `createRating`
```typescript
functions.https.onCall(async (data: {shipmentId, rating, comment}, context) => {
  const userId = requireAuth(context);
  // Verificar que el envío está completado
  // Verificar que no ha calificado antes
  // Crear calificación
  // Actualizar promedio del usuario calificado
})
```

#### 16. `getUserRatings`
```typescript
functions.https.onCall(async (data: {userId, limit?}, context) => {
  requireAuth(context);
  // Obtener calificaciones del usuario
})
```

#### 17. `getShipmentRating`
```typescript
functions.https.onCall(async (data: {shipmentId}, context) => {
  requireAuth(context);
  // Obtener calificaciones del envío
})
```

#### 18. `hasUserRatedShipment`
```typescript
functions.https.onCall(async (data: {shipmentId}, context) => {
  const userId = requireAuth(context);
  // Verificar si ya calificó
})
```

#### 19. `getUserAverageRating`
```typescript
functions.https.onCall(async (data: {userId}, context) => {
  requireAuth(context);
  // Calcular promedio
})
```

---

## ✨ FASE 2: Nuevos Endpoints (10+ recomendados)

### 🚗 **Driver Management (Gestión de Conductores)**

#### 20. `updateDriverLocation` ⭐ **IMPORTANTE**
```typescript
functions.https.onCall(async (data: {latitude, longitude}, context) => {
  const driverId = requireAuth(context);
  requireRole(context, 'driver');
  
  await admin.database().ref(`drivers/${driverId}/location`).set({
    latitude: data.latitude,
    longitude: data.longitude,
    updatedAt: admin.database.ServerValue.TIMESTAMP,
  });
  
  // Si tiene envío activo, actualizar también ahí
  const activeShipment = await getDriverActiveShipment(driverId);
  if (activeShipment) {
    await admin.database().ref(`shipments/${activeShipment.id}/currentLocation`).set({
      latitude: data.latitude,
      longitude: data.longitude,
    });
  }
})
```

**Por qué lo necesitas:** Rastreo en tiempo real del conductor

---

#### 21. `toggleDriverAvailability` ⭐
```typescript
functions.https.onCall(async (data: {available: boolean}, context) => {
  const driverId = requireAuth(context);
  requireRole(context, 'driver');
  
  await admin.database().ref(`users/${driverId}`).update({
    isAvailable: data.available,
    lastAvailabilityChange: admin.database.ServerValue.TIMESTAMP,
  });
})
```

**Por qué lo necesitas:** Controlar cuándo el conductor está disponible para recibir pedidos

---

#### 22. `getDriverStats` ⭐
```typescript
functions.https.onCall(async (data, context) => {
  const driverId = requireAuth(context);
  requireRole(context, 'driver');
  
  const shipments = await getDriverAllShipments(driverId);
  
  return {
    totalShipments: shipments.length,
    completedShipments: shipments.filter(s => s.status === 'DELIVERED').length,
    cancelledShipments: shipments.filter(s => s.status === 'CANCELLED').length,
    totalEarnings: shipments.reduce((sum, s) => sum + (s.price || 0), 0),
    averageRating: await getDriverAverageRating(driverId),
    totalRatings: await getDriverTotalRatings(driverId),
  };
})
```

**Por qué lo necesitas:** Dashboard del conductor con estadísticas

---

### 💰 **Pricing & Estimates (Precios y Estimaciones)**

#### 23. `calculateShipmentPrice` ⭐⭐ **MUY IMPORTANTE**
```typescript
functions.https.onCall(async (data: {
  origin: Location,
  destination: Location,
  cargoType: CargoType,
  weight: number
}, context) => {
  requireAuth(context);
  
  // Calcular distancia usando Google Maps API
  const distance = await calculateDistance(data.origin, data.destination);
  
  // Fórmula de precio
  const basePrice = 100; // Precio base
  const pricePerKm = 10; // $10 por km
  const weightMultiplier = data.weight > 100 ? 1.5 : 1.0;
  const cargoTypeMultiplier = {
    GENERAL: 1.0,
    FRAGILE: 1.3,
    PERISHABLE: 1.4,
    HAZARDOUS: 2.0,
    HEAVY: 1.5,
  };
  
  const calculatedPrice = (
    basePrice + 
    (distance * pricePerKm) * 
    weightMultiplier * 
    cargoTypeMultiplier[data.cargoType]
  );
  
  return {
    price: Math.round(calculatedPrice),
    distance: distance,
    estimatedTime: Math.round(distance / 40), // minutos (40 km/h promedio)
    breakdown: {
      basePrice,
      distancePrice: distance * pricePerKm,
      weightExtra: weightMultiplier > 1 ? (calculatedPrice * 0.5) : 0,
      cargoTypeExtra: cargoTypeMultiplier[data.cargoType] > 1 ? (calculatedPrice * 0.3) : 0,
    }
  };
})
```

**Por qué lo necesitas:** Cálculo automático y consistente de precios

---

#### 24. `getEstimatedDeliveryTime`
```typescript
functions.https.onCall(async (data: {
  origin: Location,
  destination: Location,
  trafficFactor?: number
}, context) => {
  requireAuth(context);
  
  const distance = await calculateDistance(data.origin, data.destination);
  const averageSpeed = 40; // km/h
  const trafficMultiplier = data.trafficFactor || 1.2;
  
  const estimatedMinutes = Math.round((distance / averageSpeed) * 60 * trafficMultiplier);
  
  return {
    estimatedMinutes,
    estimatedArrival: new Date(Date.now() + estimatedMinutes * 60000).toISOString(),
    distance,
  };
})
```

**Por qué lo necesitas:** Informar al cliente cuánto tardará su envío

---

### 📊 **Analytics & Reports (Analíticas e Informes)**

#### 25. `getClientStats` ⭐
```typescript
functions.https.onCall(async (data, context) => {
  const clientId = requireAuth(context);
  requireRole(context, 'client');
  
  const shipments = await getClientAllShipments(clientId);
  
  return {
    totalShipments: shipments.length,
    pendingShipments: shipments.filter(s => s.status === 'PENDING').length,
    inTransitShipments: shipments.filter(s => s.status === 'IN_TRANSIT').length,
    completedShipments: shipments.filter(s => s.status === 'DELIVERED').length,
    totalSpent: shipments.reduce((sum, s) => sum + (s.price || 0), 0),
    mostUsedCargoType: getMostFrequent(shipments.map(s => s.cargoType)),
  };
})
```

**Por qué lo necesitas:** Dashboard del cliente

---

#### 26. `getMonthlyReport` ⭐
```typescript
functions.https.onCall(async (data: {month: number, year: number}, context) => {
  const userId = requireAuth(context);
  const role = context.auth.token.role;
  
  const startDate = new Date(data.year, data.month - 1, 1);
  const endDate = new Date(data.year, data.month, 0);
  
  const shipments = await getShipmentsByDateRange(userId, startDate, endDate, role);
  
  return {
    month: data.month,
    year: data.year,
    totalShipments: shipments.length,
    completedShipments: shipments.filter(s => s.status === 'DELIVERED').length,
    totalAmount: shipments.reduce((sum, s) => sum + (s.price || 0), 0),
    averageShipmentValue: shipments.length > 0 
      ? shipments.reduce((sum, s) => sum + (s.price || 0), 0) / shipments.length 
      : 0,
    byCargoType: groupByCargoType(shipments),
  };
})
```

**Por qué lo necesitas:** Reportes mensuales para clientes y conductores

---

### 🔔 **Notifications (Notificaciones)**

#### 27. `registerFCMToken` ⭐⭐ **IMPORTANTE**
```typescript
functions.https.onCall(async (data: {fcmToken: string}, context) => {
  const userId = requireAuth(context);
  
  await admin.database().ref(`users/${userId}`).update({
    fcmToken: data.fcmToken,
    fcmTokenUpdatedAt: admin.database.ServerValue.TIMESTAMP,
  });
})
```

**Por qué lo necesitas:** Enviar notificaciones push

---

#### 28. `sendCustomNotification`
```typescript
functions.https.onCall(async (data: {
  targetUserId: string,
  title: string,
  body: string,
  data?: any
}, context) => {
  const senderId = requireAuth(context);
  
  const targetUser = await admin.database().ref(`users/${data.targetUserId}`).once('value');
  const fcmToken = targetUser.val()?.fcmToken;
  
  if (!fcmToken) {
    throw new functions.https.HttpsError('not-found', 'Usuario no tiene token FCM');
  }
  
  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title: data.title,
      body: data.body,
    },
    data: data.data || {},
  });
})
```

**Por qué lo necesitas:** Comunicación entre clientes y conductores

---

### 🛡️ **Safety & Verification (Seguridad y Verificación)**

#### 29. `reportIssue` ⭐
```typescript
functions.https.onCall(async (data: {
  shipmentId: string,
  issueType: 'damage' | 'delay' | 'wrong_address' | 'driver_issue' | 'other',
  description: string,
  images?: string[]
}, context) => {
  const userId = requireAuth(context);
  
  const issueRef = admin.database().ref('issues').push();
  
  await issueRef.set({
    id: issueRef.key,
    shipmentId: data.shipmentId,
    reportedBy: userId,
    issueType: data.issueType,
    description: data.description,
    images: data.images || [],
    status: 'pending',
    createdAt: admin.database.ServerValue.TIMESTAMP,
  });
  
  // Notificar a soporte
  await notifySupport(issueRef.key);
})
```

**Por qué lo necesitas:** Reporte de problemas durante el envío

---

#### 30. `verifyDriver` (Admin only)
```typescript
functions.https.onCall(async (data: {
  driverId: string,
  verified: boolean,
  verificationNotes?: string
}, context) => {
  requireAuth(context);
  requireRole(context, 'admin');
  
  await admin.database().ref(`users/${data.driverId}`).update({
    isVerified: data.verified,
    verificationNotes: data.verificationNotes,
    verifiedAt: admin.database.ServerValue.TIMESTAMP,
  });
  
  // Enviar notificación al conductor
  await sendNotificationToUser(data.driverId, {
    title: data.verified ? '✅ Verificación aprobada' : '❌ Verificación rechazada',
    body: data.verificationNotes || '',
  });
})
```

**Por qué lo necesitas:** Sistema de verificación de conductores

---

### 🔍 **Search & Discovery (Búsqueda y Descubrimiento)**

#### 31. `searchNearbyDrivers` ⭐⭐
```typescript
functions.https.onCall(async (data: {
  latitude: number,
  longitude: number,
  radius: number, // km
  limit?: number
}, context) => {
  requireAuth(context);
  
  // Obtener todos los conductores disponibles
  const driversSnapshot = await admin.database()
    .ref('users')
    .orderByChild('role')
    .equalTo('driver')
    .once('value');
  
  const drivers = [];
  driversSnapshot.forEach(child => {
    const driver = child.val();
    if (driver.isAvailable && driver.location) {
      const distance = calculateDistanceInKm(
        data.latitude,
        data.longitude,
        driver.location.latitude,
        driver.location.longitude
      );
      
      if (distance <= data.radius) {
        drivers.push({
          ...driver,
          distance,
        });
      }
    }
  });
  
  // Ordenar por distancia
  drivers.sort((a, b) => a.distance - b.distance);
  
  return drivers.slice(0, data.limit || 10);
})
```

**Por qué lo necesitas:** Mostrar conductores cercanos al cliente

---

#### 32. `getShipmentHistory`
```typescript
functions.https.onCall(async (data: {
  shipmentId: string
}, context) => {
  requireAuth(context);
  
  const historySnapshot = await admin.database()
    .ref(`shipmentHistory/${data.shipmentId}`)
    .orderByChild('timestamp')
    .once('value');
  
  const history = [];
  historySnapshot.forEach(child => {
    history.push(child.val());
  });
  
  return history;
})
```

**Por qué lo necesitas:** Ver el historial completo de cambios de un envío

---

### 💬 **Chat & Communication (Chat y Comunicación)**

#### 33. `sendMessage` ⭐
```typescript
functions.https.onCall(async (data: {
  shipmentId: string,
  message: string
}, context) => {
  const userId = requireAuth(context);
  
  const messageRef = admin.database().ref(`chats/${data.shipmentId}/messages`).push();
  
  await messageRef.set({
    id: messageRef.key,
    senderId: userId,
    message: data.message,
    timestamp: admin.database.ServerValue.TIMESTAMP,
    read: false,
  });
  
  // Notificar al otro usuario
  const shipment = await getShipment(data.shipmentId);
  const targetUserId = shipment.clientId === userId ? shipment.driverId : shipment.clientId;
  
  await sendNotificationToUser(targetUserId, {
    title: 'Nuevo mensaje',
    body: data.message,
    data: { shipmentId: data.shipmentId, type: 'new_message' },
  });
})
```

**Por qué lo necesitas:** Chat en tiempo real entre cliente y conductor

---

## 📊 Resumen de Nuevos Endpoints

| # | Endpoint | Categoría | Prioridad | Por qué lo necesitas |
|---|----------|-----------|-----------|---------------------|
| 20 | `updateDriverLocation` | Driver | ⭐⭐⭐ | Rastreo en tiempo real |
| 21 | `toggleDriverAvailability` | Driver | ⭐⭐ | Control de disponibilidad |
| 22 | `getDriverStats` | Analytics | ⭐⭐ | Dashboard conductor |
| 23 | `calculateShipmentPrice` | Pricing | ⭐⭐⭐ | Cálculo automático de precios |
| 24 | `getEstimatedDeliveryTime` | Pricing | ⭐⭐ | Estimar tiempo de entrega |
| 25 | `getClientStats` | Analytics | ⭐⭐ | Dashboard cliente |
| 26 | `getMonthlyReport` | Analytics | ⭐ | Reportes mensuales |
| 27 | `registerFCMToken` | Notifications | ⭐⭐⭐ | Push notifications |
| 28 | `sendCustomNotification` | Notifications | ⭐ | Comunicación directa |
| 29 | `reportIssue` | Safety | ⭐⭐ | Reporte de problemas |
| 30 | `verifyDriver` | Safety | ⭐⭐ | Verificación de conductores |
| 31 | `searchNearbyDrivers` | Search | ⭐⭐⭐ | Encontrar conductores cercanos |
| 32 | `getShipmentHistory` | Search | ⭐ | Trazabilidad completa |
| 33 | `sendMessage` | Chat | ⭐⭐ | Chat en tiempo real |

---

## 🎯 Roadmap de Implementación

### **Sprint 1: Migración Base (Semana 1-2)**
- [ ] Migrar Auth functions (4)
- [ ] Migrar User functions (2)
- [ ] Configurar Cloud Functions
- [ ] Actualizar app para usar Functions

### **Sprint 2: Core Shipments (Semana 3-4)**
- [ ] Migrar Shipment functions (8)
- [ ] Migrar Rating functions (5)
- [ ] Implementar Security Rules
- [ ] Testing completo

### **Sprint 3: Features Críticos (Semana 5-6)**
- [ ] `updateDriverLocation` (#20)
- [ ] `calculateShipmentPrice` (#23)
- [ ] `registerFCMToken` (#27)
- [ ] `searchNearbyDrivers` (#31)

### **Sprint 4: Analytics & Safety (Semana 7-8)**
- [ ] `getDriverStats` (#22)
- [ ] `getClientStats` (#25)
- [ ] `reportIssue` (#29)
- [ ] `verifyDriver` (#30)

### **Sprint 5: Communication (Semana 9-10)**
- [ ] `sendMessage` (#33)
- [ ] `sendCustomNotification` (#28)
- [ ] `toggleDriverAvailability` (#21)

### **Sprint 6: Nice to Have (Semana 11+)**
- [ ] `getMonthlyReport` (#26)
- [ ] `getEstimatedDeliveryTime` (#24)
- [ ] `getShipmentHistory` (#32)

---

## 🔥 TOP 5 Endpoints Más Importantes

1. **`calculateShipmentPrice`** - Evita precios inconsistentes
2. **`updateDriverLocation`** - Core feature de rastreo
3. **`registerFCMToken`** - Necesario para notificaciones
4. **`searchNearbyDrivers`** - Mejora UX del cliente
5. **`reportIssue`** - Crítico para soporte y confianza

---

## 💡 Próximos Pasos

1. **Ahora:** Empezar con la migración de los 19 endpoints existentes
2. **Después:** Implementar los 5 endpoints TOP prioritarios
3. **Luego:** Agregar el resto según necesidad

¿Empezamos con la migración? 🚀
