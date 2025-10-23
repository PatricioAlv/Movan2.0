# PASOS PARA CONFIGURAR Y EJECUTAR EL PROYECTO MOVAN 2.0

## ✅ PASO 1: Instalar Node.js y Herramientas Necesarias

1. **Instalar Node.js** (v18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **Instalar Expo CLI**
   ```powershell
   npm install -g expo-cli
   ```

3. **Instalar Android Studio** (para emulador)
   - Descarga desde: https://developer.android.com/studio
   - Durante la instalación, asegúrate de instalar Android SDK

## ✅ PASO 2: Instalar Dependencias del Proyecto

Abre PowerShell en la carpeta del proyecto (`d:\Proyectos\Movan2.0`) y ejecuta:

```powershell
npm install
```

Este comando instalará todas las dependencias necesarias:
- React Native y Expo
- Firebase SDK
- React Navigation
- InversifyJS (para inyección de dependencias)
- TypeScript
- Jest (para testing)
- Y más...

## ✅ PASO 3: Configurar Firebase

### 3.1 Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: "Movan" (o el que prefieras)
4. Acepta los términos y crea el proyecto

### 3.2 Activar Authentication

1. En el menú lateral, haz clic en "Authentication"
2. Haz clic en "Comenzar"
3. Selecciona "Correo electrónico/contraseña"
4. Activa la primera opción (Email/Password)
5. Guarda

### 3.3 Crear Realtime Database

1. En el menú lateral, haz clic en "Realtime Database"
2. Haz clic en "Crear base de datos"
3. Selecciona una ubicación (ej: us-central1)
4. Empieza en "modo de prueba"
5. Haz clic en "Habilitar"

### 3.4 Configurar Reglas de Seguridad

En la pestaña "Reglas" de Realtime Database, pega esto:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "products": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "orders": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

Haz clic en "Publicar"

### 3.5 Obtener Credenciales (Firebase Web SDK)

⚠️ **NOTA IMPORTANTE**: Estamos usando el **Firebase SDK Web** para desarrollo rápido con Expo Go.

**¿Por qué Web SDK en una app móvil?**
- ✅ Compatible con Expo Go (no necesitas compilar APK)
- ✅ Desarrollo más rápido (hot reload instantáneo)
- ✅ Funciona en Android, iOS y Web con el mismo código
- ✅ Suficiente para Auth, Database y Storage

**Cuando publiques la app**, puedes migrar a Firebase Native SDK si necesitas notificaciones push u otras features nativas.

**Pasos:**
1. En la configuración del proyecto (ícono de engranaje), ve a "Configuración del proyecto"
2. En "Tus aplicaciones", haz clic en el ícono web **(</>)**
3. Registra la app con el nombre "Movan App"
4. **COPIA LAS CREDENCIALES** que aparecen

---

## ✅ PASO 4: Configurar Android (OPCIONAL - Solo si vas a compilar APK)

⚠️ **Este paso es OPCIONAL**. Solo necesitas hacerlo si:
- Quieres compilar un APK para instalar sin Expo Go
- Necesitas notificaciones push
- Vas a publicar en Google Play

**Para desarrollo con Expo Go, SALTA este paso.**

Si decides continuar:

1. En Firebase Console, en "Configuración del proyecto"
2. Haz clic en el ícono de Android
3. Nombre del paquete: `com.movan.app`
4. Descarga el archivo `google-services.json`
5. Guárdalo en: `android/app/` (después de hacer `expo prebuild`)

## ✅ PASO 5: Ejecutar la Aplicación

### Opción A: Usando Expo Go (Recomendado para desarrollo)

1. **Instala Expo Go en tu celular Android**
   - Desde Google Play Store

2. **Inicia el servidor de desarrollo**
   ```powershell
   npm start
   ```

3. **Escanea el código QR**
   - Se abrirá una página en el navegador con un QR
   - Abre Expo Go en tu celular
   - Escanea el código QR
   - La app se cargará en tu dispositivo

### Opción B: Usando Emulador de Android

1. **Abre Android Studio**
2. **Inicia un emulador** (AVD Manager > Play)
3. **En la terminal del proyecto:**
   ```powershell
   npm run android
   ```

### Opción C: Solo Metro Bundler

```powershell
npm start
```

## ✅ PASO 6: Probar la Aplicación

1. **La app abrirá en la pantalla de Login**

2. **Registra un usuario:**
   - Ve a la pantalla de registro
   - Ingresa nombre, email y contraseña
   - Haz clic en "Registrarse"

3. **Inicia sesión:**
   - Vuelve al login
   - Ingresa las credenciales
   - Deberías ver la pantalla de productos

4. **Verifica en Firebase:**
   - Ve a Firebase Console > Realtime Database
   - Deberías ver tu usuario creado en la sección "users"

## 🧪 PASO 7: Ejecutar Tests (Opcional)

```powershell
npm test
```

## 📁 Estructura del Proyecto Creada

```
Movan2.0/
├── src/
│   ├── core/                    # ✅ Lógica de negocio pura
│   │   ├── entities/           # User, Product, Order
│   │   ├── repositories/       # Interfaces (contratos)
│   │   └── usecases/          # LoginUseCase, RegisterUseCase, etc.
│   │
│   ├── data/                   # ✅ Implementaciones de datos
│   │   ├── config/            # Firebase config
│   │   ├── datasources/       # Firebase Auth, Realtime DB, Storage
│   │   ├── models/            # DTOs y Mappers
│   │   └── repositories/      # Implementaciones concretas
│   │
│   ├── infrastructure/         # ✅ Servicios e infraestructura
│   │   ├── di/                # Inyección de dependencias
│   │   └── utils/             # Validadores, formatters, constants
│   │
│   ├── presentation/          # ✅ UI y Componentes
│   │   ├── components/        # Button, Input, Card
│   │   ├── navigation/        # AuthNavigator, MainNavigator
│   │   ├── screens/           # Login, Register, ProductList
│   │   └── theme/             # Colors, Typography, Spacing
│   │
│   └── App.tsx                # ✅ Archivo principal
│
├── __tests__/                 # ✅ Tests unitarios
├── package.json               # ✅ Dependencias
├── tsconfig.json              # ✅ Config de TypeScript
├── app.json                   # ✅ Config de Expo
├── babel.config.js            # ✅ Config de Babel
└── README.md                  # ✅ Documentación
```

## 🎯 Funcionalidades Implementadas

- ✅ Arquitectura Clean (Core, Data, Presentation, Infrastructure)
- ✅ Autenticación con Firebase (Email/Password)
- ✅ Realtime Database de Firebase
- ✅ Inyección de dependencias (InversifyJS)
- ✅ Navegación entre pantallas (React Navigation)
- ✅ Componentes reutilizables (Button, Input, Card)
- ✅ Tema personalizable
- ✅ TypeScript configurado
- ✅ Tests unitarios configurados
- ✅ Validaciones de formularios
- ✅ Manejo de errores

## 🚀 Próximos Pasos Sugeridos

1. **Agregar pantalla de ProductDetail**
2. **Implementar gestión de órdenes**
3. **Agregar imágenes a productos (Firebase Storage)**
4. **Implementar perfil de usuario**
5. **Agregar validaciones más robustas**
6. **Implementar recuperación de contraseña**
7. **Agregar modo oscuro**
8. **Implementar filtros y búsqueda de productos**
9. **Agregar carrito de compras**
10. **Implementar notificaciones push**

## ⚠️ Solución de Problemas Comunes

### Error: "Unable to resolve module"
```powershell
# Limpia la caché y reinicia
npx expo start -c
```

### Error: Firebase no configurado
- Verifica que `firebase.config.ts` exista en `src/data/config/`
- Verifica que las credenciales sean correctas
- Verifica que los servicios estén activados en Firebase Console

### Error al compilar TypeScript
```powershell
# Reinstala dependencias
Remove-Item node_modules -Recurse -Force
npm install
```

### Puerto ocupado
```powershell
# Cambia el puerto
npx expo start --port 8081
```

## 📞 Recursos Útiles

- **Expo Docs**: https://docs.expo.dev/
- **Firebase Docs**: https://firebase.google.com/docs
- **React Navigation**: https://reactnavigation.org/
- **InversifyJS**: https://inversify.io/
- **React Native**: https://reactnative.dev/

---

**¡Listo!** Tu proyecto Movan 2.0 está completamente configurado y siguiendo Clean Architecture. 🎉
