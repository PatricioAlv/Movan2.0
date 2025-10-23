# GUÍA DE CONFIGURACIÓN - MOVAN 2.0

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para emulador Android)
- Cuenta de Firebase

## 🚀 Pasos de Configuración

### 1. Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

### 2. Configurar Firebase

#### a) Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Sigue los pasos para crear tu proyecto

#### b) Activar Servicios

**Authentication:**
1. En el menú lateral, ve a "Authentication"
2. Haz clic en "Comenzar"
3. Activa "Correo electrónico/contraseña"

**Realtime Database:**
1. En el menú lateral, ve a "Realtime Database"
2. Haz clic en "Crear base de datos"
3. Selecciona la ubicación más cercana
4. Empieza en modo de prueba (cambiarás las reglas después)

#### c) Configurar la Aplicación Android
1. En la configuración del proyecto, haz clic en el ícono de Android
2. Registra la app con el package name: `com.movan.app`
3. Descarga el archivo `google-services.json`
4. **NO** lo coloques en el proyecto aún (Expo maneja esto diferente)

#### d) Obtener Credenciales Web
1. En la configuración del proyecto, agrega una aplicación web
2. Copia las credenciales del SDK de Firebase

#### e) Crear Archivo de Configuración
1. En el proyecto, ve a `src/data/config/`
2. Crea un nuevo archivo llamado `firebase.config.ts`
3. Copia el contenido de `firebase.config.example.ts`
4. Reemplaza los valores con tus credenciales:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSy...", // TU API KEY
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
```

### 3. Configurar Reglas de Firebase

En Firebase Console, ve a Realtime Database > Reglas y usa estas reglas básicas:

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
    }
  }
}
```

### 4. Ejecutar la Aplicación

#### Iniciar el servidor de desarrollo:
```bash
npm start
```

#### Ejecutar en Android:
```bash
npm run android
```

O escanea el código QR con la app Expo Go en tu dispositivo físico.

## 🏗️ Estructura del Proyecto

```
src/
├── core/                    # Lógica de negocio
│   ├── entities/           # Modelos de dominio
│   ├── repositories/       # Interfaces de repositorios
│   └── usecases/          # Casos de uso
├── data/                   # Implementaciones de datos
│   ├── config/            # Configuración de Firebase
│   ├── datasources/       # Fuentes de datos
│   ├── models/            # DTOs y mappers
│   └── repositories/      # Implementaciones de repositorios
├── infrastructure/        # Servicios e infraestructura
│   ├── di/               # Inyección de dependencias
│   └── utils/            # Utilidades
└── presentation/         # UI
    ├── components/       # Componentes reutilizables
    ├── navigation/       # Navegación
    ├── screens/         # Pantallas
    └── theme/           # Estilos y tema
```

## 🧪 Ejecutar Tests

```bash
npm test
```

## 📱 Características Implementadas

✅ Arquitectura Clean Architecture  
✅ Autenticación con Firebase (Email/Password)  
✅ Realtime Database de Firebase  
✅ Inyección de dependencias con InversifyJS  
✅ Navegación con React Navigation  
✅ TypeScript configurado  
✅ Testing con Jest  
✅ Componentes reutilizables  
✅ Tema personalizable  

## 🔄 Próximos Pasos

1. **Agregar más pantallas**: ProductDetail, Profile, etc.
2. **Implementar manejo de errores global**
3. **Agregar validaciones de formularios más robustas**
4. **Implementar almacenamiento local con AsyncStorage**
5. **Agregar imágenes y assets**
6. **Configurar notificaciones push**
7. **Agregar Analytics**
8. **Implementar CI/CD**

## ⚠️ Solución de Problemas

### Error: "Module not found"
```bash
# Limpia la caché y reinstala
rm -rf node_modules
npm install
npx expo start -c
```

### Error de Firebase
- Verifica que las credenciales en `firebase.config.ts` sean correctas
- Asegúrate de que los servicios estén activados en Firebase Console

### Error en Android
```bash
# Limpia el proyecto
cd android
./gradlew clean
cd ..
npm run android
```

## 📚 Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [InversifyJS](https://inversify.io/)

## 🤝 Contribuir

1. Crea una nueva rama para tu feature
2. Haz commit de tus cambios
3. Haz push a la rama
4. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.
