# Configuración de Google Maps (Actualizado)

## ✅ Implementación Actual

El proyecto ahora usa:
- **react-native-maps** (versión compatible con Expo SDK 51)
- **Implementación personalizada** de Google Places Autocomplete
- **Google Geocoding API** para geocodificación inversa

## 📦 Paquetes Instalados

```json
{
  "react-native-maps": "1.14.0"  // Versión compatible con Expo SDK 51
}
```

**Importante:** Se instaló usando `npx expo install react-native-maps` para asegurar compatibilidad.

## 🔧 Componentes Personalizados

### 1. AddressAutocomplete

Ubicación: `src/presentation/components/common/AddressAutocomplete.tsx`

**Implementación:**
- Usa Google Places API Autocomplete directamente vía `fetch`
- Obtiene coordenadas usando Place Details API
- No depende de librerías de terceros

**Características:**
- ✅ Autocompletado en tiempo real (después de 3 caracteres)
- ✅ Indicador de carga
- ✅ Listado de predicciones con formato mejorado
- ✅ Soporte para Argentina (`country:ar`)
- ✅ Obtiene dirección formateada y coordenadas

**Uso:**
```tsx
<AddressAutocomplete
  onSelectAddress={(location) => {
    // location = { address: string, latitude: number, longitude: number }
  }}
  placeholder="Buscar dirección"
  apiKey={GOOGLE_MAPS_CONFIG.apiKey}
  value="Dirección actual (opcional)"
/>
```

### 2. LocationPicker

Ubicación: `src/presentation/components/common/LocationPicker.tsx`

**Implementación:**
- Usa `react-native-maps` (MapView)
- Geocodificación inversa con Google Geocoding API
- Marcador arrastrable

**Características:**
- ✅ Mapa interactivo de Google
- ✅ Marcador arrastrable para selección precisa
- ✅ Convierte coordenadas a dirección automáticamente
- ✅ Modal a pantalla completa
- ✅ Botón de confirmación

**Uso:**
```tsx
<LocationPicker
  visible={showMap}
  onClose={() => setShowMap(false)}
  onSelectLocation={(location) => {
    // location = { address: string, latitude: number, longitude: number }
  }}
  initialLocation={{
    address: 'Dirección',
    latitude: -34.6037,
    longitude: -58.3816
  }}
  apiKey={GOOGLE_MAPS_CONFIG.apiKey}
/>
```

## 🔑 Configuración de API Key

### Paso 1: Obtener API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita estas APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Places API** ← Importante para autocompletado
   - **Geocoding API** ← Importante para geocodificación inversa
4. Crea credenciales (API Key)

### Paso 2: Configurar en el proyecto

**Archivo 1:** `src/infrastructure/utils/googleMaps.config.ts`
```typescript
export const GOOGLE_MAPS_CONFIG = {
  apiKey: 'TU_API_KEY_AQUI', // ← Reemplaza
};
```

**Archivo 2:** `app.json`
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_API_KEY_AQUI"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_API_KEY_AQUI"
      }
    }
  }
}
```

### Paso 3: Reiniciar

```bash
# Detén el servidor (Ctrl+C)
npm start
```

## 💰 Costos

### Plan Gratuito
- **$200 USD de crédito gratis/mes** en Google Maps Platform
- Con uso moderado, debería ser suficiente para desarrollo y testing

### Costos por API
- **Places Autocomplete:** ~$2.83 por 1000 requests
- **Place Details:** ~$17 por 1000 requests  
- **Geocoding:** ~$5 por 1000 requests
- **Maps SDK (móvil):** Gratis para uso estándar

### Recomendación
Configura alertas de facturación en Google Cloud Console:
1. Ve a "Billing" > "Budgets & alerts"
2. Crea alerta para $200 (o menos)

## 🐛 Solución de Problemas

### Error: "codegenNativeCommands is not a function"

**Causa:** Versión de `react-native-maps` incompatible con Expo

**Solución aplicada:**
```bash
npm uninstall react-native-maps
npx expo install react-native-maps
```

### El autocompletado no funciona

**Verificar:**
1. ✅ API Key configurada en `googleMaps.config.ts`
2. ✅ Places API habilitada en Google Cloud
3. ✅ API Key sin restricciones (para desarrollo)
4. ✅ Escribir al menos 3 caracteres

**Revisar logs:**
```
Error 400: Bad Request → API Key incorrecta
Error 403: REQUEST_DENIED → API no habilitada
Error 429: OVER_QUERY_LIMIT → Límite excedido
```

### El mapa no se muestra

**Verificar:**
1. ✅ Maps SDK for Android/iOS habilitado
2. ✅ API Key en `app.json`
3. ✅ Reiniciaste Expo después de modificar `app.json`
4. ✅ Usando versión compatible: `react-native-maps@1.14.0`

### Advertencia de placeholder API Key

Si ves este mensaje en la app:
```
⚠️ Configura tu Google Maps API Key en:
src/infrastructure/utils/googleMaps.config.ts
```

Significa que todavía tienes el placeholder `'YOUR_GOOGLE_MAPS_API_KEY'`.

## 📱 Testing

### En Expo Go

Funciona perfectamente con:
- ✅ Android en Expo Go
- ✅ iOS en Expo Go

### Build independiente

Si haces build con EAS:
```bash
eas build --platform android
eas build --platform ios
```

Todo funciona sin configuración adicional.

## 🔄 Flujo de Usuario

### Crear Envío (CreateShipmentScreen)

1. Usuario ve formulario con dos secciones: Origen y Destino
2. Para cada ubicación puede:
   
   **Opción A: Autocompletado**
   - Escribe dirección
   - Selecciona de la lista
   - ✅ Coordenadas obtenidas automáticamente
   
   **Opción B: Mapa interactivo**
   - Presiona "📍 Seleccionar en el mapa"
   - Arrastra marcador
   - Presiona "Confirmar ubicación"
   - ✅ Dirección y coordenadas obtenidas

3. Completa detalles del envío
4. Crea envío → Firebase

## 🎨 Personalización

### Cambiar región de búsqueda

En `AddressAutocomplete.tsx`, línea ~45:
```typescript
&components=country:ar  // Cambiar 'ar' por otro código de país
```

Ejemplos:
- `country:mx` → México
- `country:cl` → Chile
- `country:co` → Colombia

### Cambiar ubicación inicial del mapa

En `LocationPicker.tsx`, línea ~30:
```typescript
const [region, setRegion] = useState({
  latitude: initialLocation?.latitude || -34.6037,  // Buenos Aires
  longitude: initialLocation?.longitude || -58.3816,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
});
```

### Personalizar estilos

Ambos componentes usan el sistema de tema:
- `colors` de `@presentation/theme/colors`
- `spacing` de `@presentation/theme/spacing`
- `typography` de `@presentation/theme/typography`

## 🚀 Alternativas Futuras

Si Google Maps resulta muy costoso:

### 1. OpenStreetMap (Nominatim)
- **Ventaja:** 100% gratuito
- **Desventaja:** Menos preciso
```typescript
// Autocomplete
https://nominatim.openstreetmap.org/search?q=${query}&format=json

// Geocoding inverso
https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json
```

### 2. Mapbox
- **Ventaja:** Más económico que Google
- Plan gratuito: 100,000 requests/mes
```bash
npx expo install @rnmapbox/maps
```

### 3. Entrada manual (sin mapa)
- Simplemente usar Input estándar
- Usuario escribe dirección completa
- Geocodificar en backend si es necesario

## 📚 Referencias

- [Google Maps Platform](https://developers.google.com/maps)
- [react-native-maps (Expo)](https://docs.expo.dev/versions/latest/sdk/map-view/)
- [Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Docs](https://developers.google.com/maps/documentation/geocoding)
