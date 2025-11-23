
README PARA DEVS - 

comentario de Gercho: esto se supone que tiene que ser como se administra la arquitectura de Movan, para que sigamos con esta convencion >:D

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------

⚙️ src/core — El corazón del dominio
Esta capa define qué es tu mundo y qué reglas tiene. No sabe nada de Firebase, ni de AsyncStorage, o HTTP. Es puro dominio.

[entities/]

Define las entidades del sistema.
Son clases o tipos que representan conceptos del dominio: Guardian, Item, Usuario, Batalla, etc.
Aquí no hay lógica de plataforma, sólo estructura y comportamiento esencial.

[repositories/]

Son interfaces, no implementaciones.
Declaran qué operaciones espera el dominio. Pero no saben cómo se hacen. Son contratos que luego otras capas deberán cumplir.

getGuardians()
addItemToGuardian(id, item)
updateEnergy(id, value)

[usecases/]

Cada caso de uso encapsula una intención del usuario:
“Agregar un ítem”, “crear un guardián”, “iniciar sesión”, “actualizar energía”…

Ejemplo conceptual:

class AddItemUseCase {
   constructor(guardiansRepository){}
   execute(id, item) {
      return guardiansRepository.addItem(id, item)
   }
}

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------

🧱 src/data — La capa intermedia que adapta el mundo y la realidad - -

Esta capa transforma los modelos crudos (Firebase, JSON, APIs) en entidades seguras del dominio.

[datasources/]
Implementan cómo se obtiene la información:

- Firebase
- AsyncStorage
- APIs HTTP
- Archivos locales
- MockDataSources para testing

Ejemplo:
FirebaseGuardiansDatasource implementa “traer los guardians desde Firebase”.

[models/]

Modelos que adaptan datos externos al dominio.
Transforman lo que viene del backend a GuardianEntity.

Ejemplo:

class GuardianModel {
   static fromFirebase(data) {...}
   toEntity() {...}
}

[repositories/]

Aquí se implementan las interfaces de core/repositories.
Son la fusión entre datasource + models + reglas menores de ensamblado.

Flow interno:

usecase → repositorio(data) → datasource → firestore/json/api

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------

🏗️ src/infrastructure — Servicios concretos que conectan con el mundo real

Aquí viven:

Inicialización de Firebase.

Config general.

Servicios externos.

Implementaciones que no deberían mezclarse con el dominio.

Cuando un datasource necesita Firebase, lo obtiene desde acá.

[di/] “Dependency Injection”

Registro de instancias para que cualquier capa reciba lo que necesita sin instanciar directamente.

Ejemplo:

container.register('GuardiansRepository', () => new GuardiansRepositoryImpl(...))

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------

🎨 src/presentation — La interfaz visible: pantallas, navegación y UI

Es la capa que mira al usuario.

[components/]

{ Botones, listas, cartas, loaders, etc. }

[navigation/]

Stacks, tabs, navigators, rutas.

[screens/]

Pages como:

- HomeScreen
- GuardiansScreen
- BattleScreen
- InventoryScreen

Cada screen solo debería llamar a un caso de uso, y nunca a Firebase directamente.

[theme/]

Estilos globales: colores, tipografías, spacing.

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------

🔧 [utils/]

Funciones que no pertenecen al dominio, pero sirven en todo el proyecto:

- formatters
- validaciones
- helpers

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------

¿Cuál es el flujo real dentro de esta arquitectura?

1. El usuario toca un botón → Presentation

Una screen llama a un caso de uso:

addItemUseCase.execute(guardianId, item)

2. → Core (usecases)

El caso de uso recibe la acción y pide al repositorio hacer el trabajo.

3. → Data (repositories)

El repositorio implementado traduce esa acción a un datasource.

4. → Data (datasource)

El datasource conecta:

[Firebase]
[AsyncStorage]
[API]

Archivo local (según tu proyecto)

5. → Infrastructure

Infraestructura provee la instancia física del servicio (firebase.app, firestore, etc).

6. Respuesta hacia atrás

Datos → model → entity → usecase → screen.

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------

presentation (UI)
    ↓
usecases (reglas de aplicación)
    ↓
repositories (contratos)
    ↓
data/repositories (implementaciones)
    ↓
datasources (conexiones reales)
    ↓
infrastructure (firebase/api/storage)

-------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------
