# Taskflow Backend — Documentación Técnica y Arquitectura

Servidor REST construido con Node.js y Express. Diseño basado en **Separación de Responsabilidades (SoC)** y arquitectura por capas estrictas.

---

## 1. Arquitectura del sistema — Diseño en capas (Fase B)

El servidor está estructurado para ser completamente independiente del frontend. Toda comunicación es exclusivamente JSON. Sin renderizado en el servidor (SSR), se han eliminado las dependencias de persistencia local (LocalStorage) para centralizar la gestión de recursos en el servidor.

        ```
        Petición HTTP entrante
                ↓
        [ CORS + JSON Parser + Logger ]   ← Middlewares globales
                ↓
        [ Router /api/v1/tasks ]          ← Capa de ruteo
                ↓
        [ Controller ]                    ← Valida datos, gestiona respuesta HTTP
                ↓
        [ Service ]                       ← Lógica de negocio pura, sin Express
                ↓
        Respuesta HTTP (JSON)
        ```

### Estructura de carpetas

    ```
    /root
    ├── vercel.json                 ← configuración de rewrites para Vercel
    ├── index.html                  ← frontend (raíz)
    ├── api.js                      ← capa de red (fetch)
    ├── script2.js                  ← lógica DOM
    └── server/
        ├── .env                    ← variables de entorno (no en GitHub)
        ├── .gitignore
        ├── package.json
        └── src/
            ├── index.js            ← punto de entrada, middlewares, arranque
            ├── config/
            │   └── env.js          ← carga y valida variables de entorno
            ├── routes/
            │   └── task.routes.js  ← mapea URLs a controladores
            ├── controllers/
            │   └── task.controller.js ← orquesta HTTP → servicio
            └── services/
                └── task.service.js ← lógica pura sin Express
    ```

### Responsabilidad de cada capa
El backend se organiza en capas para facilitar el mantenimiento y la escalabilidad:

- Capa de Entrada: **`index.js` el Motor del backend**
    index.js es el punto de entrada que arranca el *servidor Express* y configura los middlewares globales (CORS, JSON Parser)  y monta las rutas. Es el único archivo que sabe que existe un servidor HTTP.
    
- Capa de Ruteo:  **`routes/` — Capa de ruteo (tonta)**
    Su única misión es mapear una URL (Define los puntos de entrada (paths) de la API (/api/v1/tasks) y un verbo HTTP al controlador correcto. (Es tonta) No toma decisiones.

    ```javascript
    router.get("/", controller.getTasks);
    router.post("/", controller.createTask);
    router.delete("/:id", controller.deleteTask);
    ```

- Capa de Controladores:  **`controllers/` — Director de orquesta**
    Actúa como puente, validando los datos de las peticiones HTTP,  gestionando las respuestas y códigos de estado (200, 201, 400). Y Devuelve los códigos HTTP correctos.

- Capa de Servicios: **`services/` — Corazón intelectual**
    Contiene la lógica de negocio pura, permitiendo manipular las tareas (de forma aislada) sin depender del framework Express. No sabe nada de Express, HTTP, `req` ni `res`.



## 2.  Pruebas de Robustez, manejo de excepciones y pruebas de red (FASE C)

**API Endpoints**
Base URL local: `http://localhost:3000/api/v1`
Base URL producción: `https://taskflow3-tarea2y1.vercel.app/api/v1`

### Tabla de API Endpoints (v1) 
La comunicación se realiza mediante JSON, eliminando cualquier dependencia de renderizado en el servidor (SSR).

Los endpoints implementados son:

| Método | Ruta | Cuerpo (Request) | Respuesta (Success)    | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **GET**    | `/api/v1/tasks`  | N/A | `200 OK`            | Retorna lista completa de tareas almacenadas. |
| **POST**   | `/api/v1/tasks`            | `{ "title": "str", "priority": "str" }` | `201 Created` | Registra una nueva tarea con un identificador único (UUID). |
| **DELETE** | `/api/v1/tasks/:id` | N/A | `204 No Content` | Elimina permanentemente una tarea por su ID. |

### Ejemplos de interacción

**GET — Obtener tareas**
```
GET /api/v1/tasks
→ 200 [ { "id": "1234", "title": "Pintar Orco", "completed": false } ]
```

**POST — Crear tarea correcta**
```
POST /api/v1/tasks
Body: { "title": "Pintar Orco Warboss" }
→ 201 { "id": "1774377060856", "title": "Pintar Orco Warboss", "completed": false }
```

**POST — Validación (error intencionado)**
```
POST /api/v1/tasks
Body: {}
→ 400 { "error": "Title is required" }
```

**DELETE — Borrado exitoso**
```
DELETE /api/v1/tasks/1774377060856
→ 204 (sin body)
```

**DELETE — ID inexistente (error intencionado)**
```
DELETE /api/v1/tasks/orkork999
→ 404 { "error": "Recurso no encontrado" }
```

---



## 3.   Middlewares Técnicos y Robustez (FASE C)

**Definición de MIDDLEWARE**
    Un middleware es una función que se ejecuta entre que llega la petición y que se envía la respuesta. Express los encadena en orden:

    ```
    Petición → cors() → express.json() → logger → Ruta → Controlador → Respuesta
                                                                ↓ (si hay error)
                                                        errorHandler → Respuesta
    ```


Se han implementado y configurado middlewares esenciales para garantizar un entorno de producción estable:

### `cors()` - Cross-Origin Resource Sharing
    **CORS (Cross-Origin Resource Sharing):** 
        Configurado para autorizar peticiones desde el frontend desplegado en **Vercel**, solucionando los bloqueos de seguridad de navegación por origen cruzado.

### `express.json()` - Parser de body       
    - **Express JSON Parser:** 
        Middleware encargado de interpretar y parsear los cuerpos de los mensajes entrantes en formato JSON (`application/json`).

### Logger personalizado — Auditoría
Registra en consola el método HTTP, la ruta, el código de respuesta y el tiempo transcurrido. Útil para depurar el tráfico durante el desarrollo.

```javascript
app.use((req, res, next) => {
    const inicio = Date.now();
    res.on('finish', () => {
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${Date.now() - inicio}ms)`);
    });
    next();
});
```

### Gestor de Errores Global - *Error handler global* — 4 parámetros
Red de seguridad que impide que el proceso daemon de Node.js muera ante un error no controlado. Captura excepciones de cualquier capa y las mapea a códigos HTTP semánticos.

```javascript
app.use((err, req, res, next) => {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Recurso no encontrado' });
    console.error(err); // solo en servidor, nunca al cliente
    res.status(500).json({ error: 'Error interno del servidor' });
});
```

**Regla de seguridad:** nunca se envían trazas técnicas al cliente, solo mensajes genéricos controlados.

---


## 4.  Configuración e Infraestructura (Fase A)
En esta fase, se ha transformado el servidor en un entorno flexible y profesional:

1. Inyección de Dependencias: Uso de **"npm install dotenv"** para la gestión de entorno y *express* para el levantamiento de la API.
    - Gestión de Variables de Entorno: Se implementó dotenv para separar la configuración sensible (como el puerto o futuras credenciales de BD) del código fuente. Esto permite que el proyecto se adapte automáticamente al entorno de desarrolo

2. Configuración por Variables de Entorno: Se aisló la configuración del sistema mediante un archivo ".env". Esto garantiza que el servidor sea agnóstico al entorno, funcionando igual en mi PC local que en los servidores de Vercel sin cambiar ni una línea de código.

### Variables de entorno, documento - File (`.env`)
```
PORT=3000
```
**NOTA**
El archivo `.env` nunca se sube a GitHub. En producción Vercel inyecta las variables automáticamente — el código no cambia entre entornos.

### Módulo de configuración (`config/env.js`)
Valida que las variables existen antes de arrancar. Si `PORT` no está definido lanza un error y el servidor se niega a iniciar.

```javascript
require('dotenv').config();
if (!process.env.PORT) throw new Error('El puerto no está definido en .env');
module.exports = { PORT: process.env.PORT };
```

3. Seguridad y Conectividad (CORS): Se integró el middleware de CORS para definir políticas de acceso seguro, permitiendo que el Frontend (estático) se comunique sin restricciones con los Endpoints del Backend.

4. Estandarización de Datos: Se configuró el servidor para trabajar exclusivamente con application/json, eliminando cualquier rastro de renderizado clásico (SSR) para cumplir con el estándar de una API REST moderna.


### Scripts disponibles

```bash
npm run dev    # nodemon src/index.js — reinicia al guardar
npm run start  # node src/index.js — producción
```

## 5. Robustez, Persistencia y Validación de Red (FASE C y D)
Durante la fase de integración, se realizaron pruebas de estrés y refactorizaciones críticas para asegurar que la API sea un sistema sólido y predecible.

-  Resolución del Fallo de Persistencia en Borrados (DELETE)
    
    Problema detectado: Al intentar eliminar una tarea, la interfaz reflejaba el borrado visual, pero la terminal del servidor mostraba peticiones POST erróneas o IDs inexistentes. La tarea reaparecía al recargar (F5).

    Causa: El frontend enviaba IDs locales (temporales) que el backend no reconocía.

    Solución: Se refactorizó la lógica en script2.js para que el cliente utilice exclusivamente el UUID oficial generado por el servidor. Se implementó un flujo asíncrono donde, tras la animación de salida, se invoca deleteTask(taskId) y se confirma el estado mediante una recarga de la lista desde el servidor (loadTasks).


### Pruebas de Integración (Thunder Client)

Resultados documentados forzando errores intencionados:

| Prueba | Petición | Código esperado | Resultado |
|---|---|---|---|
| Listar tareas | GET `/api/v1/tasks` | `200` | ✅ |
| Crear tarea | POST con `{ "title": "ORCOS" }` | `201` | ✅ |
| Validación frontera | POST con `{}` | `400` | ✅ |
| Borrado exitoso | DELETE `/tasks/:id` real | `204` | ✅ |
| ID inexistente | DELETE `/tasks/999999` | `404` | ✅ |

*NOTA*  para más documentación ver doc-FASE C en carpeta "doc/"

---









## 6.  Gestión de la Persistencia (Fase D)
El backend utiliza persistencia volátil en memoria RAM. Al estar desplegado en una infraestructura Serverless (Vercel), el contenedor del servidor se apaga tras periodos de inactividad. Esto provoca que el listado de tareas se reinicie. Esta decisión de diseño es intencionada para demostrar una arquitectura 100% basada en API REST sin dependencias de bases de datos externas en esta fase.

Esta decisión es **intencionada** en esta fase para demostrar una arquitectura 100% REST sin dependencias externas. La solución de producción real sería conectar una base de datos persistente (MongoDB Atlas, PostgreSQL).

Fix de Sincronización de Esquemas: Validación de la conversión de campos del frontend al backend (mapeo de `titulo/prioridad` del cliente a `title/priority` del servidor), garantizando la integridad de la información.

Eliminación de LocalStorage: En script2.js las funciones de guardar en localStorage se borraron o comentaron (//), para que todo dependa de la API.

---

## 7. Bitácora de errores y soluciones (Fase D)

- **Error CORS con `file://`**
Problema: Al abrir `index.html` directamente el navegador bloqueaba todas las peticiones.
Solución: Usar Live Server para servir bajo `http://`.

- **`Cannot use import statement outside a module`**
Problema: Módulos ES6 bloqueados.
Solución: Añadir `type="module"` en `<script>` de `index.html`.

- **DELETE enviaba POST al servidor**
Problema: El handler del botón llamaba a la función local en lugar de la API.
Solución: Refactorizar con llamada asíncrona a `deleteTask(id)` seguida de `loadTasks()`.

*Mini Bitacora del problema - solución*
Se detectaron duplicidades en las funciones de comunicación. Se saneó el archivo eliminando declaraciones redundantes, dejando una capa de abstracción limpia donde cada función (get, post, delete) cumple una única responsabilidad.

Sincronización de Datos y Estados de UI
    Mapeo de Campos: Se corrigió la discrepancia de idiomas, asegurando que el frontend envíe title y priority para coincidir con el esquema del backend.

    Física del Mundo Real: Se implementaron estados de carga ("Guardando...") y bloqueo de botones para gestionar la latencia de red y evitar peticiones duplicadas.

    Resiliencia: Uso de bloques try/catch para gestionar errores 500 o caídas de servidor, informando al usuario mediante avisos visuales en lugar de dejar la app en un estado inconsistente.

- **Error 400 por discrepancia de campos**
Problema: Frontend enviaba `titulo/prioridad`, backend esperaba `title/priority`.
Solución: Estandarizar objetos JSON en `script2.js`.

- **MIME type error en Vercel**
Problema: Vercel enviaba `index.html` cuando el navegador pedía archivos `.js`, causando error de tipo MIME.
Solución: Ajustar `vercel.json` para resolver rutas estáticas sin interceptar con el rewrite del HTML.

- **Problema con las tags de categoria y prioridad, no aparecen en el vercel**
Problema: En la app al añadir tareas "x" aparece el error undefined.
Solución: Era un problema de nomenclatura (Case Sensitivity)
    Se ha aplicado la convención camelCase empezando en minúscula para todos los identificadores del proyecto. Esto evita errores de puntero nulo (null) al intentar acceder a elementos del DOM cuyos IDs no coincidían exactamente en mayúsculas/minúsculas entre el documento HTML y la lógica de JavaScript.
---


## Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Entorno de ejecución |
| Express | 4.x | Framework HTTP |
| cors | — | Política cross-origin |
| dotenv | — | Variables de entorno |
| nodemon | — | Recarga en desarrollo |
| Thunder Client | — | Pruebas de endpoints |
| Vercel | — | Despliegue serverless |