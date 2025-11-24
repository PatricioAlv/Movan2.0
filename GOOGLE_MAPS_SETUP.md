# Guía de Configuración de Google Maps

## 📋 Resumen
Se han integrado Google Maps en la aplicación para permitir:
- ✅ Autocompletar direcciones con Google Places API
- ✅ Seleccionar ubicaciones en un mapa interactivo
- ✅ Obtener coordenadas automáticamente

## 🔑 Paso 1: Obtener Google Maps API Key

### 1.1 Crear/Seleccionar Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Anota el nombre del proyecto

### 1.2 Habilitar las APIs necesarias
En Google Cloud Console, habilita las siguientes APIs:

1. **Maps SDK for Android**
   - Ve a "APIs & Services" > "Library"
   - Busca "Maps SDK for Android"
   - Haz clic en "Enable"

2. **Maps SDK for iOS**
   - Busca "Maps SDK for iOS"
   - Haz clic en "Enable"

3. **Places API**
   - Busca "Places API"
   - Haz clic en "Enable"

4. **Geocoding API**
   - Busca "Geocoding API"
   - Haz clic en "Enable"

### 1.3 Crear la API Key
1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "+ CREATE CREDENTIALS"
3. Selecciona "API key"
4. Copia la API key generada
5. (Recomendado) Restringe la API key:
   - Haz clic en "Edit API key"
   - En "Application restrictions", selecciona tu tipo de aplicación
   - En "API restrictions", selecciona las 4 APIs mencionadas arriba
   - Guarda los cambios

## ⚙️ Paso 2: Configurar la API Key en la Aplicación

### 2.1 Archivo de configuración principal
Edita el archivo:
\`\`\`
src/infrastructure/utils/googleMaps.config.ts
\`\`\`

Reemplaza `'YOUR_GOOGLE_MAPS_API_KEY'` con tu API key real:
\`\`\`typescript
export const GOOGLE_MAPS_CONFIG = {
  apiKey: 'AIzaSy...tu-api-key-aqui', // ← Pega tu API key aquí
  defaultRegion: {
    latitude: -34.6037, // Buenos Aires, Argentina
    longitude: -58.3816,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
};
\`\`\`

### 2.2 Configuración en app.json
Edita el archivo `app.json` y reemplaza ambas instancias de `YOUR_GOOGLE_MAPS_API_KEY`:

\`\`\`json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "AIzaSy...tu-api-key-aqui"  // ← Android
    }
  }
},
"ios": {
  "config": {
    "googleMapsApiKey": "AIzaSy...tu-api-key-aqui"  // ← iOS
  }
}
\`\`\`

### 2.3 Componente LocationPicker
Edita el archivo:
\`\`\`
src/presentation/components/common/LocationPicker.tsx
\`\`\`

En la línea ~58, reemplaza `TU_API_KEY_AQUI` con tu API key:
\`\`\`typescript
const response = await fetch(
  \`https://maps.googleapis.com/maps/api/geocode/json?latlng=\${selectedLocation.latitude},\${selectedLocation.longitude}&key=AIzaSy...tu-api-key-aqui\`  // ← Aquí
);
\`\`\`

## 🚀 Paso 3: Reiniciar la Aplicación

Después de configurar las API keys:

1. Detén el servidor de Expo (Ctrl+C)
2. Limpia la caché y reinicia:
   \`\`\`bash
   npm start -- --clear
   \`\`\`
3. Recarga la app en tu dispositivo/emulador

## 🎯 Uso de las Nuevas Funcionalidades

### Autocompletar dirección
1. En el formulario de "Nuevo Envío"
2. Comienza a escribir una dirección en el campo de origen o destino
3. Aparecerá una lista de sugerencias
4. Selecciona una dirección de la lista
5. Las coordenadas se completarán automáticamente

### Seleccionar en el mapa
1. Presiona el botón "📍 Seleccionar en el mapa"
2. Se abrirá un mapa interactivo
3. Toca en cualquier punto del mapa
4. Aparecerá un marcador
5. Presiona "Confirmar ubicación"
6. La dirección y coordenadas se completarán automáticamente

## 🔒 Seguridad de la API Key

### Para desarrollo:
- Puedes usar la API key sin restricciones durante el desarrollo

### Para producción:
1. **Restringe por aplicación**:
   - Android: Añade la firma SHA-1 de tu app
   - iOS: Añade el Bundle ID de tu app

2. **Restringe por API**:
   - Solo permite las 4 APIs necesarias

3. **Monitoreo**:
   - Revisa regularmente el uso en Google Cloud Console
   - Configura alertas de cuota

## 💰 Facturación

Google Maps tiene un plan gratuito generoso:
- $200 USD de crédito mensual gratuito
- Aprox. 28,000 solicitudes de autocompletar gratis al mes
- Aprox. 28,000 geocoding requests gratis al mes

## ⚠️ Solución de Problemas

### La API key no funciona
- Verifica que todas las APIs estén habilitadas
- Espera unos minutos después de crear la key
- Verifica que no haya restricciones incorrectas

### No aparecen sugerencias de direcciones
- Verifica la consola del navegador para errores
- Asegúrate de que Places API esté habilitada
- Verifica que la API key sea correcta

### El mapa no se muestra
- Verifica que Maps SDK esté habilitado para tu plataforma
- Revisa los permisos de ubicación en app.json
- Reinicia la app completamente

## 📁 Archivos Modificados/Creados

- ✅ `src/components/common/AddressAutocomplete.tsx` - Autocompletado
- ✅ `src/components/common/LocationPicker.tsx` - Selector de mapa
- ✅ `src/screens/client/CreateShipmentScreen.tsx` - Integración
- ✅ `src/infrastructure/utils/googleMaps.config.ts` - Configuración
- ✅ `app.json` - Configuración de Expo

## 🎨 Modo de respaldo

Si no configuras la API key, la app mostrará un mensaje de advertencia pero seguirá funcionando con el botón "📝 Usar datos de ejemplo".
