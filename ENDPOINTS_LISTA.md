# 📋 Lista de Endpoints - Firebase Realtime Database

## 🔐 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `signInWithEmailAndPassword` + `get` | `users/{uid}` | Iniciar sesión |
| `createUserWithEmailAndPassword` + `set` | `users/{uid}` | Registrar nuevo usuario |
| `signOut` | - | Cerrar sesión |
| `get` | `users/{currentUserId}` | Obtener usuario actual |

---

## 👤 Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `get` | `users/{userId}` | Obtener usuario por ID |
| `update` | `users/{userId}` | Actualizar información de usuario |

---

## 📦 Envíos (Shipments)

| Método | Endpoint | Filtro/Query | Descripción |
|--------|----------|--------------|-------------|
| `push` + `set` | `shipments/{newId}` | - | Crear nuevo envío |
| `get` | `shipments/{shipmentId}` | - | Obtener envío por ID |
| `query` | `shipments` | `orderByChild('clientId')` + `equalTo(clientId)` | Obtener envíos del cliente |
| `query` | `shipments` | `orderByChild('status')` + `equalTo('pending')` | Obtener envíos disponibles |
| `query` | `shipments` | `orderByChild('driverId')` + `equalTo(driverId)` | Obtener envíos del conductor |
| `update` | `shipments/{shipmentId}` | - | Actualizar estado del envío |
| `update` | `shipments/{shipmentId}` | - | Cancelar envío (status = 'cancelled') |
| `update` | `shipments/{shipmentId}` | - | Aceptar envío (asignar conductor) |

---

## ⭐ Calificaciones (Ratings)

| Método | Endpoint | Filtro/Query | Descripción |
|--------|----------|--------------|-------------|
| `push` + `set` + `update` | `ratings/{newId}` + `userRatings/{toUserId}/{ratingId}` + `users/{toUserId}` | - | Crear calificación |
| `get` + `get` (múltiple) | `userRatings/{userId}` → `ratings/{ratingId}` | - | Obtener calificaciones de usuario |
| `query` | `ratings` | `orderByChild('shipmentId')` + `equalTo(shipmentId)` | Obtener calificaciones de envío |
| `query` | `ratings` | `orderByChild('shipmentId')` + `equalTo(shipmentId)` | Verificar si usuario calificó envío |
| `get` (cálculo) | Usa `getRatingsByUser` | - | Obtener promedio de calificaciones |

---

## 📊 Índices (UserRatings)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `set` | `userRatings/{userId}/{ratingId}` | Crear índice de calificación (automático al crear rating) |
| `get` | `userRatings/{userId}` | Obtener índice de calificaciones de usuario |

---

## 📈 Resumen por Colección

### `users/`
- **READ**: `users/{userId}`
- **WRITE**: `users/{userId}`
- **UPDATE**: `users/{userId}`

### `shipments/`
- **CREATE**: `shipments/{newId}` (push + set)
- **READ**: `shipments/{shipmentId}`
- **READ con filtro**: `shipments` (query + orderByChild + equalTo)
- **UPDATE**: `shipments/{shipmentId}`

### `ratings/`
- **CREATE**: `ratings/{newId}` (push + set)
- **READ con filtro**: `ratings` (query + orderByChild + equalTo)

### `userRatings/`
- **WRITE**: `userRatings/{userId}/{ratingId}`
- **READ**: `userRatings/{userId}`

---

## 🔢 Total de Endpoints

- **Autenticación**: 4 endpoints
- **Usuarios**: 2 endpoints
- **Envíos**: 8 endpoints
- **Calificaciones**: 5 endpoints
- **Total**: **19 endpoints**

---

## 📝 Notas

- Todos los endpoints requieren autenticación (`auth != null`)
- Las fechas se almacenan en formato ISO8601 string
- Los queries con filtros usan `orderByChild()` + `equalTo()`
- Las actualizaciones automáticas de `averageRating` y `totalRatings` se realizan al crear calificaciones
- El índice `userRatings` se mantiene automáticamente para optimizar consultas

---

**Proyecto:** Movan 2.0  
**Última actualización:** 27 de noviembre de 2025
