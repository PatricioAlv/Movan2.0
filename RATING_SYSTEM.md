# Sistema de Calificaciones (Rating System)

## Descripción General

El sistema de calificaciones permite a clientes y transportistas calificarse mutuamente después de completar un envío, similar al sistema de Uber. Las calificaciones van del 1 al 5 estrellas.

## Componentes Principales

### 1. Entidades

#### Rating (`src/core/entities/Rating.ts`)
```typescript
interface Rating {
  id: string;
  shipmentId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: Date;
}
```

#### User (Actualizado)
Ahora incluye:
- `averageRating?: number` - Promedio de calificaciones
- `totalRatings?: number` - Total de calificaciones recibidas

#### Shipment (Actualizado)
Ahora incluye:
- `clientRating` - Calificación del cliente al transportista
- `driverRating` - Calificación del transportista al cliente

### 2. Casos de Uso

#### CreateRatingUseCase
Crea una nueva calificación para un usuario.

```typescript
const createRatingUseCase = container.get<CreateRatingUseCase>(TYPES.CreateRatingUseCase);
await createRatingUseCase.execute(fromUserId, {
  shipmentId: 'shipment-123',
  toUserId: 'user-456',
  rating: 5,
  comment: 'Excelente servicio'
});
```

#### GetUserRatingsUseCase
Obtiene todas las calificaciones de un usuario.

```typescript
const getUserRatingsUseCase = container.get<GetUserRatingsUseCase>(TYPES.GetUserRatingsUseCase);
const ratings = await getUserRatingsUseCase.execute(userId);
```

#### GetUserAverageRatingUseCase
Obtiene el promedio y total de calificaciones de un usuario.

```typescript
const getUserAverageRatingUseCase = container.get<GetUserAverageRatingUseCase>(
  TYPES.GetUserAverageRatingUseCase
);
const { average, total } = await getUserAverageRatingUseCase.execute(userId);
```

#### HasUserRatedShipmentUseCase
Verifica si un usuario ya calificó un envío específico.

```typescript
const hasUserRatedShipmentUseCase = container.get<HasUserRatedShipmentUseCase>(
  TYPES.HasUserRatedShipmentUseCase
);
const hasRated = await hasUserRatedShipmentUseCase.execute(userId, shipmentId);
```

### 3. Componentes UI

#### StarRating
Componente para mostrar y seleccionar estrellas.

```tsx
import { StarRating } from '@presentation/components/common/StarRating';

// Solo visualización
<StarRating rating={4.5} size={24} showCount />

// Editable
<StarRating 
  rating={rating}
  size={32}
  editable
  onRatingChange={(newRating) => setRating(newRating)}
/>
```

**Props:**
- `rating: number` - Calificación actual (0-5)
- `maxStars?: number` - Máximo de estrellas (default: 5)
- `size?: number` - Tamaño de las estrellas en px (default: 24)
- `editable?: boolean` - Si se puede modificar (default: false)
- `onRatingChange?: (rating: number) => void` - Callback al cambiar
- `showCount?: boolean` - Mostrar número junto a estrellas (default: false)

#### RatingModal
Modal para calificar a un usuario después de un envío.

```tsx
import { RatingModal } from '@presentation/components/common/RatingModal';

const [showRatingModal, setShowRatingModal] = useState(false);

<RatingModal
  visible={showRatingModal}
  onClose={() => setShowRatingModal(false)}
  onSubmit={async (rating, comment) => {
    await createRatingUseCase.execute(currentUserId, {
      shipmentId: shipment.id,
      toUserId: targetUserId,
      rating,
      comment,
    });
  }}
  targetUserName={targetUser.name}
  userType="driver" // o "client"
/>
```

**Props:**
- `visible: boolean` - Controla la visibilidad del modal
- `onClose: () => void` - Callback al cerrar
- `onSubmit: (rating: number, comment?: string) => Promise<void>` - Callback al enviar
- `targetUserName: string` - Nombre del usuario a calificar
- `userType: 'client' | 'driver'` - Tipo de usuario

#### UserRatingDisplay
Muestra el promedio de calificaciones de un usuario.

```tsx
import { UserRatingDisplay } from '@presentation/components/common/UserRatingDisplay';

<UserRatingDisplay
  averageRating={user.averageRating}
  totalRatings={user.totalRatings}
  size="medium"
  showLabel
/>
```

**Props:**
- `averageRating?: number` - Promedio de calificaciones
- `totalRatings?: number` - Total de calificaciones
- `size?: 'small' | 'medium' | 'large'` - Tamaño (default: 'medium')
- `showLabel?: boolean` - Mostrar contador (default: true)

#### RatingList
Lista de calificaciones recibidas por un usuario.

```tsx
import { RatingList } from '@presentation/components/common/RatingList';

<RatingList userId={user.id} />
```

### 4. Hook Personalizado

#### useRating
Hook que facilita el uso del sistema de calificaciones.

```tsx
import { useRating } from '@presentation/hooks/useRating';

const MyComponent = () => {
  const { createRating, getUserRating, checkIfUserRated, isSubmitting, error } = useRating();

  const handleRating = async () => {
    try {
      await createRating(currentUserId, {
        shipmentId: 'shipment-123',
        toUserId: 'user-456',
        rating: 5,
        comment: 'Excelente'
      });
    } catch (err) {
      console.error('Error:', error);
    }
  };

  const loadUserRating = async () => {
    const { average, total } = await getUserRating('user-456');
    console.log(`Promedio: ${average}, Total: ${total}`);
  };

  const checkRating = async () => {
    const hasRated = await checkIfUserRated(currentUserId, 'shipment-123');
    if (hasRated) {
      console.log('Ya calificaste este envío');
    }
  };

  return (
    // ...
  );
};
```

## Flujo de Uso Típico

### Para el Cliente (Calificar al Transportista)

1. El cliente completa un envío
2. Después de que el envío es marcado como DELIVERED
3. Se muestra un botón o prompt para calificar al transportista
4. Se abre el `RatingModal`
5. El cliente selecciona estrellas y opcionalmente deja un comentario
6. Se crea la calificación
7. El promedio del transportista se actualiza automáticamente

```tsx
// Ejemplo en ShipmentDetailScreen (Cliente)
const handleRateDriver = async (rating: number, comment?: string) => {
  try {
    await createRatingUseCase.execute(currentUser.id, {
      shipmentId: shipment.id,
      toUserId: shipment.driverId!,
      rating,
      comment,
    });
    Alert.alert('Éxito', 'Calificación enviada');
  } catch (error) {
    Alert.alert('Error', 'No se pudo enviar la calificación');
  }
};

// Verificar si ya calificó
useEffect(() => {
  if (shipment.status === ShipmentStatus.DELIVERED) {
    checkIfUserRated(currentUser.id, shipment.id).then(setHasRatedDriver);
  }
}, [shipment]);

// Mostrar botón solo si no ha calificado
{!hasRatedDriver && shipment.status === ShipmentStatus.DELIVERED && (
  <Button 
    title="Calificar Transportista"
    onPress={() => setShowRatingModal(true)}
  />
)}

<RatingModal
  visible={showRatingModal}
  onClose={() => setShowRatingModal(false)}
  onSubmit={handleRateDriver}
  targetUserName={shipment.driverName!}
  userType="driver"
/>
```

### Para el Transportista (Calificar al Cliente)

Similar al flujo del cliente, pero en sentido inverso.

```tsx
// Ejemplo en ShipmentDetailScreen (Transportista)
const handleRateClient = async (rating: number, comment?: string) => {
  try {
    await createRatingUseCase.execute(currentUser.id, {
      shipmentId: shipment.id,
      toUserId: shipment.clientId,
      rating,
      comment,
    });
    Alert.alert('Éxito', 'Calificación enviada');
  } catch (error) {
    Alert.alert('Error', 'No se pudo enviar la calificación');
  }
};

<RatingModal
  visible={showRatingModal}
  onClose={() => setShowRatingModal(false)}
  onSubmit={handleRateClient}
  targetUserName={clientName}
  userType="client"
/>
```

## Estructura en Firebase Realtime Database

```
ratings/
  ├── rating-id-1
  │   ├── shipmentId: "shipment-123"
  │   ├── fromUserId: "user-456"
  │   ├── fromUserName: "Juan Pérez"
  │   ├── toUserId: "user-789"
  │   ├── toUserName: "María García"
  │   ├── rating: 5
  │   ├── comment: "Excelente servicio"
  │   └── createdAt: 1234567890
  └── rating-id-2
      └── ...

userRatings/
  ├── user-789
  │   ├── rating-id-1: true
  │   └── rating-id-3: true
  └── user-456
      └── rating-id-2: true

users/
  ├── user-789
  │   ├── averageRating: 4.5
  │   ├── totalRatings: 10
  │   └── ...
  └── ...
```

## Validaciones Implementadas

1. **Rango de calificación**: Solo acepta valores entre 1 y 5
2. **Límite de caracteres**: El comentario tiene un límite de 500 caracteres
3. **Usuarios válidos**: Verifica que tanto el usuario que califica como el calificado existan
4. **Actualización automática**: El promedio del usuario se actualiza automáticamente al recibir una nueva calificación

## Notas Importantes

- Las calificaciones son inmutables una vez creadas
- Un usuario solo puede calificar una vez por envío (implementa la verificación en tu UI)
- El promedio se redondea a 1 decimal
- Las medias estrellas se muestran cuando hay decimales (ej: 4.5 ★★★★½)

## Próximos Pasos Sugeridos

1. Implementar la lógica en las pantallas de detalle de envío
2. Agregar notificaciones cuando se recibe una nueva calificación
3. Mostrar el promedio de calificaciones en los perfiles de usuario
4. Implementar filtros para mostrar solo envíos pendientes de calificación
