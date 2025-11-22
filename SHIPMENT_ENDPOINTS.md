# Endpoints de Envíos - API Documentation

## Estructura de Datos

### Shipment (Envío)
```typescript
interface Shipment {
  id: string;
  clientId: string;
  driverId?: string;
  origin: Location;
  destination: Location;
  cargoType: CargoType;
  cargoDescription: string;
  weight: number;
  price: number;
  status: ShipmentStatus;
  pickupDate: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}
```

### Location
```typescript
interface Location {
  address: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
}
```

### CargoType
```typescript
enum CargoType {
  GENERAL = 'GENERAL',
  FRAGILE = 'FRAGILE',
  PERISHABLE = 'PERISHABLE',
  HAZARDOUS = 'HAZARDOUS',
  HEAVY = 'HEAVY',
}
```

### ShipmentStatus
```typescript
enum ShipmentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
```

## Casos de Uso Disponibles

### 1. CreateShipmentUseCase
Crear un nuevo envío.

```typescript
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { CreateShipmentUseCase } from '@core/usecases/shipments/CreateShipmentUseCase';
import { CargoType } from '@core/entities/Order';

const createShipmentUseCase = container.get<CreateShipmentUseCase>(
  TYPES.CreateShipmentUseCase
);

const newShipment = await createShipmentUseCase.execute(
  'client-user-id-123',
  {
    origin: {
      address: 'Calle 123, Ciudad A',
      latitude: -34.6037,
      longitude: -58.3816,
      contactName: 'Juan Pérez',
      contactPhone: '+54911234567',
    },
    destination: {
      address: 'Avenida 456, Ciudad B',
      latitude: -32.8895,
      longitude: -68.8458,
      contactName: 'María González',
      contactPhone: '+54911765432',
    },
    cargoType: CargoType.GENERAL,
    cargoDescription: 'Electrodomésticos',
    weight: 500,
    price: 25000,
    pickupDate: new Date('2025-11-25T10:00:00'),
    notes: 'Manejar con cuidado',
  }
);
```

### 2. GetClientShipmentsUseCase
Obtener todos los envíos de un cliente.

```typescript
import { GetClientShipmentsUseCase } from '@core/usecases/shipments/GetClientShipmentsUseCase';

const getClientShipmentsUseCase = container.get<GetClientShipmentsUseCase>(
  TYPES.GetClientShipmentsUseCase
);

const shipments = await getClientShipmentsUseCase.execute('client-user-id-123');
```

### 3. GetShipmentByIdUseCase
Obtener un envío por su ID.

```typescript
import { GetShipmentByIdUseCase } from '@core/usecases/shipments/GetShipmentByIdUseCase';

const getShipmentByIdUseCase = container.get<GetShipmentByIdUseCase>(
  TYPES.GetShipmentByIdUseCase
);

const shipment = await getShipmentByIdUseCase.execute('shipment-id-123');
```

### 4. CancelShipmentUseCase
Cancelar un envío.

```typescript
import { CancelShipmentUseCase } from '@core/usecases/shipments/CancelShipmentUseCase';

const cancelShipmentUseCase = container.get<CancelShipmentUseCase>(
  TYPES.CancelShipmentUseCase
);

await cancelShipmentUseCase.execute('shipment-id-123');
```

## Reglas de Firebase

Las reglas de Firebase Realtime Database permiten:

- Cualquier usuario autenticado puede leer envíos
- Solo el cliente o el conductor asignado pueden modificar un envío
- Se valida que todos los campos requeridos estén presentes

## Ejemplo de Integración en Componente React Native

```typescript
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { container } from '@infrastructure/di/container';
import { TYPES } from '@infrastructure/di/types';
import { CreateShipmentUseCase } from '@core/usecases/shipments/CreateShipmentUseCase';
import { CargoType } from '@core/entities/Order';

export const CreateShipmentScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateShipment = async () => {
    setLoading(true);
    try {
      const createShipmentUseCase = container.get<CreateShipmentUseCase>(
        TYPES.CreateShipmentUseCase
      );

      const newShipment = await createShipmentUseCase.execute(
        'current-user-id',
        {
          origin: {
            address: 'Origen',
            latitude: -34.6037,
            longitude: -58.3816,
          },
          destination: {
            address: 'Destino',
            latitude: -32.8895,
            longitude: -68.8458,
          },
          cargoType: CargoType.GENERAL,
          cargoDescription: 'Carga general',
          weight: 100,
          price: 5000,
          pickupDate: new Date(),
        }
      );

      Alert.alert('Éxito', `Envío creado: ${newShipment.id}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button
        title={loading ? 'Creando...' : 'Crear Envío'}
        onPress={handleCreateShipment}
        disabled={loading}
      />
    </View>
  );
};
```

## Validaciones

El sistema valida automáticamente:

- Origen y destino son obligatorios
- Peso debe ser mayor a 0
- Precio no puede ser negativo
- Descripción de carga es obligatoria

## Base de Datos

Los envíos se almacenan en Firebase Realtime Database en la ruta `/shipments/` con la siguiente estructura:

```json
{
  "shipments": {
    "shipment-id-123": {
      "id": "shipment-id-123",
      "clientId": "client-user-id",
      "origin": {
        "address": "Calle 123",
        "latitude": -34.6037,
        "longitude": -58.3816
      },
      "destination": {
        "address": "Avenida 456",
        "latitude": -32.8895,
        "longitude": -68.8458
      },
      "cargoType": "GENERAL",
      "cargoDescription": "Electrodomésticos",
      "weight": 500,
      "price": 25000,
      "status": "PENDING",
      "pickupDate": "2025-11-25T10:00:00.000Z",
      "createdAt": "2025-11-22T12:00:00.000Z",
      "updatedAt": "2025-11-22T12:00:00.000Z"
    }
  }
}
```
