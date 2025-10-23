# 📱 MOVAN 2.0 - Proyecto React Native con Clean Architecture

## 🎯 Descripción del Proyecto

Aplicación móvil Android construida con React Native y Expo, siguiendo los principios de **Clean Architecture**. Integra Firebase para autenticación y base de datos en tiempo real.

## 🏗️ Arquitectura Clean

Este proyecto implementa Clean Architecture con 4 capas principales:

### 1️⃣ CORE (Lógica de Negocio Pura)
- ✅ **Entities**: Modelos de dominio (User, Product, Order)
- ✅ **Use Cases**: Lógica de negocio (LoginUseCase, RegisterUseCase, etc.)
- ✅ **Repository Interfaces**: Contratos que deben implementar las capas externas
- ❌ **Sin dependencias externas**: Solo TypeScript puro
- ❌ **No conoce**: React, Firebase, ni ninguna implementación

### 2️⃣ DATA (Implementaciones de Datos)
- ✅ **Repositories**: Implementaciones concretas de las interfaces del Core
- ✅ **DataSources**: Acceso a Firebase, AsyncStorage, etc.
- ✅ **Models**: DTOs (Data Transfer Objects)
- ✅ **Mappers**: Convierten entre DTOs y Entities
- ⚡ **Depende de**: Core (interfaces)
- ❌ **No conoce**: Presentation

### 3️⃣ PRESENTATION (UI y Componentes)
- ✅ **Screens**: Pantallas de la aplicación
- ✅ **Components**: Componentes reutilizables
- ✅ **Navigation**: Configuración de rutas
- ✅ **ViewModels**: Estado y lógica de UI
- ✅ **Theme**: Estilos, colores, tipografía
- ⚡ **Depende de**: Core (use cases y entities)
- ❌ **No conoce**: Data (solo a través de interfaces)

### 4️⃣ INFRASTRUCTURE (Servicios y Utilidades)
- ✅ **Dependency Injection**: InversifyJS container
- ✅ **Services**: Notificaciones, Analytics, etc.
- ✅ **Utils**: Validadores, formateadores, constantes
- ⚡ **Conecta**: Todas las capas mediante DI

## 📂 Estructura Completa del Proyecto

```
d:\Proyectos\Movan2.0/
│
├── 📄 package.json              # Dependencias del proyecto
├── 📄 tsconfig.json             # Configuración de TypeScript
├── 📄 app.json                  # Configuración de Expo
├── 📄 babel.config.js           # Configuración de Babel
├── 📄 jest.config.js            # Configuración de Jest
├── 📄 .eslintrc.js              # Configuración de ESLint
├── 📄 .prettierrc.js            # Configuración de Prettier
├── 📄 .gitignore                # Archivos ignorados por Git
│
├── 📄 README.md                 # Documentación principal
├── 📄 PASOS_CONFIGURACION.md    # Guía paso a paso (ESTE ARCHIVO)
├── 📄 SETUP_GUIDE.md            # Guía de configuración
├── 📄 COMANDOS_UTILES.md        # Comandos útiles
│
├── 📁 .vscode/                  # Configuración de VS Code
│   ├── settings.json
│   └── extensions.json
│
├── 📁 src/                      # 🎯 Código fuente principal
│   │
│   ├── 📁 core/                 # 🔵 CAPA CORE (Lógica de Negocio)
│   │   │
│   │   ├── 📁 entities/         # Modelos de dominio
│   │   │   ├── User.ts          # ✅ Entidad de Usuario
│   │   │   ├── Product.ts       # ✅ Entidad de Producto
│   │   │   └── Order.ts         # ✅ Entidad de Orden
│   │   │
│   │   ├── 📁 repositories/     # Interfaces de repositorios
│   │   │   ├── IAuthRepository.ts       # ✅ Interfaz de Auth
│   │   │   ├── IProductRepository.ts    # ✅ Interfaz de Products
│   │   │   └── IStorageRepository.ts    # ✅ Interfaz de Storage
│   │   │
│   │   └── 📁 usecases/         # Casos de uso (lógica de negocio)
│   │       ├── 📁 auth/
│   │       │   ├── LoginUseCase.ts      # ✅ Login
│   │       │   ├── RegisterUseCase.ts   # ✅ Registro
│   │       │   └── LogoutUseCase.ts     # ✅ Logout
│   │       │
│   │       └── 📁 products/
│   │           ├── GetProductsUseCase.ts    # ✅ Obtener productos
│   │           └── CreateProductUseCase.ts  # ✅ Crear producto
│   │
│   ├── 📁 data/                 # 🟢 CAPA DATA (Implementaciones)
│   │   │
│   │   ├── 📁 config/           # Configuración
│   │   │   └── firebase.config.example.ts  # ✅ Ejemplo de config
│   │   │   # 🔐 firebase.config.ts (crear manualmente)
│   │   │
│   │   ├── 📁 datasources/      # Fuentes de datos
│   │   │   ├── 📁 remote/
│   │   │   │   ├── FirebaseAuthDataSource.ts      # ✅ Auth de Firebase
│   │   │   │   └── FirebaseRealtimeDataSource.ts  # ✅ Realtime DB
│   │   │   │
│   │   │   └── 📁 local/
│   │   │       ├── AsyncStorageDataSource.ts      # ✅ AsyncStorage
│   │   │       └── SecureStorageDataSource.ts     # ✅ SecureStore
│   │   │
│   │   ├── 📁 models/           # DTOs y Mappers
│   │   │   ├── UserModel.ts     # ✅ DTO de User
│   │   │   ├── ProductModel.ts  # ✅ DTO de Product
│   │   │   │
│   │   │   └── 📁 mappers/
│   │   │       ├── UserMapper.ts     # ✅ Mapper User
│   │   │       └── ProductMapper.ts  # ✅ Mapper Product
│   │   │
│   │   └── 📁 repositories/     # Implementaciones concretas
│   │       ├── FirebaseAuthRepository.ts      # ✅ Impl. Auth
│   │       └── FirebaseProductRepository.ts   # ✅ Impl. Products
│   │
│   ├── 📁 infrastructure/       # 🔶 CAPA INFRASTRUCTURE
│   │   │
│   │   ├── 📁 di/               # Dependency Injection
│   │   │   ├── types.ts         # ✅ Símbolos de DI
│   │   │   └── container.ts     # ✅ Container de InversifyJS
│   │   │
│   │   └── 📁 utils/            # Utilidades
│   │       ├── validators.ts    # ✅ Validadores
│   │       ├── formatters.ts    # ✅ Formateadores
│   │       └── constants.ts     # ✅ Constantes
│   │
│   ├── 📁 presentation/         # 🟣 CAPA PRESENTATION (UI)
│   │   │
│   │   ├── 📁 theme/            # Tema de la app
│   │   │   ├── colors.ts        # ✅ Paleta de colores
│   │   │   ├── typography.ts    # ✅ Tipografía
│   │   │   └── spacing.ts       # ✅ Espaciados y sombras
│   │   │
│   │   ├── 📁 components/       # Componentes reutilizables
│   │   │   └── 📁 common/
│   │   │       ├── Button.tsx   # ✅ Botón personalizado
│   │   │       ├── Input.tsx    # ✅ Input personalizado
│   │   │       └── Card.tsx     # ✅ Card personalizada
│   │   │
│   │   ├── 📁 screens/          # Pantallas de la app
│   │   │   ├── 📁 auth/
│   │   │   │   ├── LoginScreen.tsx     # ✅ Pantalla de Login
│   │   │   │   └── RegisterScreen.tsx  # ✅ Pantalla de Registro
│   │   │   │
│   │   │   └── 📁 products/
│   │   │       └── ProductListScreen.tsx  # ✅ Lista de productos
│   │   │
│   │   └── 📁 navigation/       # Navegación
│   │       ├── AppNavigator.tsx    # ✅ Navegador principal
│   │       ├── AuthNavigator.tsx   # ✅ Navegador de Auth
│   │       └── MainNavigator.tsx   # ✅ Navegador principal
│   │
│   └── 📄 App.tsx               # ✅ Archivo principal de la app
│
└── 📁 __tests__/                # 🧪 Tests unitarios
    └── 📁 core/
        └── 📁 usecases/
            └── 📁 auth/
                └── LoginUseCase.test.ts  # ✅ Test de LoginUseCase
```

## 🎨 Flujo de Datos (Clean Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  (UI, Screens, Components, Navigation, ViewModels)      │
│                                                          │
│  LoginScreen → Usa LoginUseCase                         │
└────────────────────┬────────────────────────────────────┘
                     │ Depende de ↓
                     │
┌────────────────────▼────────────────────────────────────┐
│                      CORE LAYER                          │
│      (Entities, Use Cases, Repository Interfaces)       │
│                                                          │
│  LoginUseCase → Usa IAuthRepository (interface)         │
└────────────────────┬────────────────────────────────────┘
                     │ Implementado por ↓
                     │
┌────────────────────▼────────────────────────────────────┐
│                      DATA LAYER                          │
│  (Repository Implementations, DataSources, Models)      │
│                                                          │
│  FirebaseAuthRepository → Usa FirebaseAuthDataSource    │
└────────────────────┬────────────────────────────────────┘
                     │ Conectado por ↓
                     │
┌────────────────────▼────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                     │
│         (DI Container, Services, Utils)                  │
│                                                          │
│  Container: Conecta interfaces con implementaciones      │
└─────────────────────────────────────────────────────────┘
```

## ✨ Tecnologías Utilizadas

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| **Framework** | React Native | 0.74.5 | Framework móvil |
| **Plataforma** | Expo | ~51.0.0 | Herramientas de desarrollo |
| **Lenguaje** | TypeScript | ~5.3.3 | Tipado estático |
| **Backend** | Firebase | ^10.7.1 | Auth + Realtime DB |
| **Navegación** | React Navigation | ^6.1.9 | Navegación entre pantallas |
| **DI** | InversifyJS | ^6.0.2 | Inyección de dependencias |
| **Storage** | AsyncStorage | 1.23.1 | Almacenamiento local |
| **Testing** | Jest | ^29.7.0 | Tests unitarios |
| **Linting** | ESLint | ^8.56.0 | Análisis de código |

## 🎯 Características Implementadas

### ✅ Autenticación
- [x] Login con email/password
- [x] Registro de usuarios
- [x] Logout
- [x] Persistencia de sesión
- [x] Validación de formularios

### ✅ Productos
- [x] Listar productos
- [x] Crear productos
- [x] Realtime updates

### ✅ Arquitectura
- [x] Clean Architecture
- [x] Inyección de dependencias
- [x] Repository pattern
- [x] Use cases
- [x] Mappers (DTO ↔ Entity)

### ✅ UI/UX
- [x] Componentes reutilizables
- [x] Tema personalizado
- [x] Navegación fluida
- [x] Feedback de carga

### ✅ Calidad de Código
- [x] TypeScript strict mode
- [x] Tests unitarios
- [x] ESLint configurado
- [x] Prettier configurado

## 🚀 Próximas Características Sugeridas

### 🔜 Fase 1 - Completar CRUD
- [ ] ProductDetailScreen
- [ ] Editar producto
- [ ] Eliminar producto
- [ ] Búsqueda y filtros

### 🔜 Fase 2 - Gestión de Usuarios
- [ ] ProfileScreen
- [ ] Editar perfil
- [ ] Cambiar contraseña
- [ ] Recuperar contraseña
- [ ] Subir foto de perfil

### 🔜 Fase 3 - Órdenes
- [ ] Carrito de compras
- [ ] Crear orden
- [ ] Historial de órdenes
- [ ] Detalle de orden
- [ ] Estados de orden

### 🔜 Fase 4 - Features Avanzadas
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Múltiples idiomas (i18n)
- [ ] Analytics
- [ ] Crashlytics
- [ ] Deep linking

### 🔜 Fase 5 - Optimizaciones
- [ ] Caché local
- [ ] Offline mode
- [ ] Optimistic UI
- [ ] Lazy loading
- [ ] Code splitting

## 📱 Flujo de Usuario Actual

```
┌──────────────┐
│  App Start   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ ¿Autenticado?    │
└──────┬───────────┘
       │
       ├─── NO ──→ ┌────────────────┐
       │           │  LoginScreen   │
       │           └────────┬───────┘
       │                    │
       │                    ├─→ ┌──────────────────┐
       │                    │   │ RegisterScreen   │
       │                    │   └──────────────────┘
       │                    │
       │           ┌────────▼───────┐
       │           │  Login Success │
       │           └────────┬───────┘
       │                    │
       └─── SÍ ───┬────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  ProductListScreen   │
       └──────────────────────┘
```

## 🔐 Variables de Entorno y Secretos

### ⚠️ IMPORTANTE - NO SUBIR A GIT

Estos archivos contienen información sensible:

1. **`src/data/config/firebase.config.ts`**
   - Credenciales de Firebase
   - ✅ Ya está en `.gitignore`
   - 📝 Usa `firebase.config.example.ts` como plantilla

2. **`google-services.json`** (para builds de Android)
   - Credenciales de Google
   - ✅ Ya está en `.gitignore`

## 📊 Métricas del Proyecto

- **Líneas de código**: ~2,500+
- **Archivos creados**: 50+
- **Componentes**: 3 reutilizables
- **Pantallas**: 3 funcionales
- **Use Cases**: 5 implementados
- **Tests**: 1 ejemplo (expandible)
- **Cobertura de tests**: Por implementar

## 🤝 Guía de Contribución

### Agregar un Nuevo Feature

1. **Crear entidad** (si es necesario)
   ```typescript
   // src/core/entities/MiEntidad.ts
   export interface MiEntidad {
     id: string;
     // propiedades...
   }
   ```

2. **Crear interfaz de repositorio**
   ```typescript
   // src/core/repositories/IMiRepository.ts
   export interface IMiRepository {
     metodo(): Promise<MiEntidad>;
   }
   ```

3. **Crear use case**
   ```typescript
   // src/core/usecases/mi-feature/MiUseCase.ts
   @injectable()
   export class MiUseCase {
     // implementación...
   }
   ```

4. **Crear implementación del repositorio**
   ```typescript
   // src/data/repositories/MiRepository.ts
   @injectable()
   export class MiRepository implements IMiRepository {
     // implementación...
   }
   ```

5. **Registrar en DI**
   ```typescript
   // src/infrastructure/di/container.ts
   container.bind<IMiRepository>(TYPES.IMiRepository)
     .to(MiRepository);
   ```

6. **Crear pantalla**
   ```typescript
   // src/presentation/screens/mi-feature/MiScreen.tsx
   export const MiScreen: React.FC = () => {
     // UI...
   };
   ```

7. **Agregar a navegación**
   ```typescript
   // src/presentation/navigation/MainNavigator.tsx
   <Stack.Screen name="MiScreen" component={MiScreen} />
   ```

## 📞 Recursos y Enlaces

- 📖 [Documentación de Expo](https://docs.expo.dev/)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- 🧭 [React Navigation](https://reactnavigation.org/)
- 💉 [InversifyJS](https://inversify.io/)
- 📘 [TypeScript](https://www.typescriptlang.org/)
- 🧪 [Jest](https://jestjs.io/)

---

**✨ ¡Proyecto creado exitosamente! Ahora sigue los pasos en `PASOS_CONFIGURACION.md` para configurar Firebase y ejecutar la app.**
