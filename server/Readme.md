
**NOTA**
*README BACKEND documento exhaustivo y técnico *

# Taskflow Backend: Arquitectura y API REST 

Este directorio contiene el servidor (backend) de la aplicación Taskflow, construido sobre Node.js y el framework Express. Su diseño sigue una arquitectura desacoplada y con principios de **Separación de Responsabilidades (SoC)**


## 1.  Arquitectura del Sistema y Diseño en Capas (FASE B)
El servidor está estructurado para ser independiente del frontend, permitiendo una comunicación puramente basada en datos (JSON). Se han eliminado las dependencias de persistencia local (LocalStorage) para centralizar la gestión de recursos en el servidor.

El backend se organiza en capas para facilitar el mantenimiento y la escalabilidad:

- Capa de Entrada
    index.js: Punto de entrada que arranca el servidor Express y configura los middlewares globales (CORS, JSON Parser).
    Es el motor del backend

- Capa de Ruteo
    routes/: Definición de los puntos de entrada (paths) de la API (/api/v1/tasks) y asociación con sus controladores correspondientes.

- Capa de Controladores
    controllers/: Actúa como puente, validando los datos de las peticiones HTTP y gestionando las respuestas y códigos de estado (200, 201, 400).Capa de orquestación encargada de validar la petición HTTP y gestionar la respuesta (Status Codes).

- Capa de Servicios
    services/: Contiene la lógica de negocio pura, permitiendo manipular las tareas sin depender del framework Express.

## Esquema de Arquitectura de Carpetas

Se ha elegido una estructura clara que separa las responsabilidades del código (Separation of Concerns):

    /root
    ├── vercel.json           # Configuración de rutas para la nube (Rewrites)
    ├── index.html            # Estructura principal (Raíz)
    ├── api.js                # Capa de Red (Fetch)
    ├── script2.js            # Lógica de Negocio y DOM
    └── /server               # Backend
        └── /src
            └── index.js      # Punto de entrada de Express

Arquitectura Desacoplada: Explica que el proyecto sigue un modelo de separación donde el cliente y el servidor residen en directorios distintos.

## 2.  Pruebas de Robustez, manejo de excepciones y pruebas de red (FASE C)

### Tabla de API Endpoints (v1) 
La comunicación se realiza mediante JSON, eliminando cualquier dependencia de renderizado en el servidor (SSR).

Los endpoints implementados son:

| Método | Ruta | Cuerpo (Request) | Respuesta (Success)    | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **GET**    | `/api/v1/tasks`  | N/A | `200 OK`            | Retorna lista completa de tareas almacenadas. |
| **POST**   | `/api/v1/tasks`            | `{ "title": "str", "priority": "str" }` | `201 Created` | Registra una nueva tarea con un identificador único (UUID). |
| **DELETE** | `/api/v1/tasks/:id` | N/A | `204 No Content` | Elimina permanentemente una tarea por su ID. |


## 3.   Middlewares Técnicos y Robustez (FASE C)
Para garantizar que el proceso "daemon" de Node.js no muera ante un error, se implementó un middleware de 4 parámetros en `index.js`. Este actúa como una red de seguridad que captura errores de la capa de servicios (como 'NOT_FOUND') y los mapea a códigos HTTP semánticos, protegiendo la integridad del servidor.

Se han implementado y configurado middlewares esenciales para garantizar un entorno de producción estable:

    - **CORS (Cross-Origin Resource Sharing):** 
        Configurado para autorizar peticiones desde el frontend desplegado en **Vercel**, solucionando los bloqueos de seguridad de navegación por origen cruzado.
    - **Express JSON Parser:** 
        Middleware encargado de interpretar y parsear los cuerpos de los mensajes entrantes en formato JSON (`application/json`).
    - **Gestor de Errores Global:** 
        Sistema centralizado que captura excepciones y errores de lógica, devolviendo respuestas estructuradas al cliente para evitar la exposición de trazas técnicas o información sensible del servidor.

### Manejo Global de Excepciones
Para garantizar que el proceso "daemon" de Node.js no muera ante un error, se implementó un middleware de 4 parámetros en `index.js`. Este actúa como una red de seguridad que captura errores de la capa de servicios (como 'NOT_FOUND') y los mapea a códigos HTTP semánticos, protegiendo la integridad del servidor.

- Funcionamiento de Middlewares (Terminología Técnica)

        El servidor utiliza Middlewares para procesar las peticiones antes de que lleguen a las rutas finales:

        CORS (Cross-Origin Resource Sharing): Fundamental para permitir que el frontend (ej. puerto 5500) tenga permiso para solicitar recursos al backend (puerto 3000). Sin este middleware, el navegador bloquea la conexión por seguridad.

        express.json(): Un "parser" que analiza el cuerpo de las peticiones entrantes. Convierte el flujo de datos binarios en un objeto JavaScript accesible mediante req.body.

        Middleware de Manejo de Errores (Global): Implementado con 4 parámetros (err, req, res, next). Captura cualquier excepción en el flujo de ejecución, loguea el error en el servidor y devuelve una respuesta HTTP controlada (500) al cliente, evitando fugas de información técnica sensible.



## 4.  Configuración e Infraestructura (Fase A)

En esta fase, se ha transformado el servidor en un entorno flexible y profesional:

    - Gestión de Variables de Entorno: Se implementó dotenv para separar la configuración sensible (como el puerto o futuras credenciales de BD) del código fuente. Esto permite que el proyecto se adapte automáticamente al entorno de desarrollo local o al entorno de producción en Vercel.

    - Arquitectura de Servidor: Se configuró un servidor Express optimizado para el intercambio de datos JSON, eliminando cualquier dependencia de renderizado en el lado del servidor (SSR) para favorecer una arquitectura 100% API REST.

1. Inyección de Dependencias: Uso de **"npm install dotenv"** para la gestión de entorno y *express* para el levantamiento de la API.

2. Configuración por Variables de Entorno: Se aisló la configuración del sistema mediante un archivo ".env". Esto garantiza que el servidor sea agnóstico al entorno, funcionando igual en mi PC local que en los servidores de Vercel sin cambiar ni una línea de código.

3. Seguridad y Conectividad (CORS): Se integró el middleware de CORS para definir políticas de acceso seguro, permitiendo que el Frontend (estático) se comunique sin restricciones con los Endpoints del Backend.

4. Estandarización de Datos: Se configuró el servidor para trabajar exclusivamente con application/json, eliminando cualquier rastro de renderizado clásico (SSR) para cumplir con el estándar de una API REST moderna.

**NOTA. PROBLEMAS con Vercel**
EL ultimo gran "fix" fue en vercel.json. Eso fue la evolución de esta Fase A.

        Fallo de "MIME type" en Despliegue:

        Problema: Al mover archivos a la raíz, la configuración de rewrites de Vercel enviaba el contenido de index.html cuando el navegador pedía archivos .js, causando un error de "Expected a JavaScript module script but the server responded with a MIME type of text/html".

        Solución: Se ajustó vercel.json para que las rutas estáticas se resuelvan correctamente sin ser interceptadas por la redirección global del HTML.



## 5. Robustez, Persistencia y Validación de Red (FASE C y D)
Durante la fase de integración, se realizaron pruebas de estrés y refactorizaciones críticas para asegurar que la API sea un sistema sólido y predecible.

-  Resolución del Fallo de Persistencia en Borrados (DELETE)
    
    Problema detectado: Al intentar eliminar una tarea, la interfaz reflejaba el borrado visual, pero la terminal del servidor mostraba peticiones POST erróneas o IDs inexistentes. La tarea reaparecía al recargar (F5).

    Causa: El frontend enviaba IDs locales (temporales) que el backend no reconocía.

    Solución: Se refactorizó la lógica en script2.js para que el cliente utilice exclusivamente el UUID oficial generado por el servidor. Se implementó un flujo asíncrono donde, tras la animación de salida, se invoca deleteTask(taskId) y se confirma el estado mediante una recarga de la lista desde el servidor (loadTasks).


-  Documentación de Pruebas de Integración (Thunder Client)
Se validaron los contratos de la API forzando respuestas de error y éxito:

    Creación Exitosa (201 Created): Se validó el envío de JSON { "title": "ORCOS" }. El servidor asignó automáticamente un ID único y respondió con el objeto completo, confirmando la persistencia en memoria.

    Validación de Frontera (400 Bad Request): Se testeó el envío de cuerpos vacíos. El controlador bloqueó la entrada devolviendo un mensaje de error semántico: "El título es obligatorio".

    Gestor de Recursos Inexistentes (404 Not Found): Al intentar borrar un ID ficticio (/tasks/999999), el Middleware Global de Errores capturó la excepción y devolvió un código 404, evitando la exposición de errores internos del sistema.

    Borrado Exitoso (204 No Content): Se confirmó que tras un DELETE válido, el servidor responde sin cuerpo (204) y los GET posteriores devuelven la lista actualizada.


-  Refactorización de la Capa de Red (api.js)
Se detectaron duplicidades en las funciones de comunicación. Se saneó el archivo eliminando declaraciones redundantes, dejando una capa de abstracción limpia donde cada función (get, post, delete) cumple una única responsabilidad.

-  Sincronización de Datos y Estados de UI
    Mapeo de Campos: Se corrigió la discrepancia de idiomas, asegurando que el frontend envíe title y priority para coincidir con el esquema del backend.

    Física del Mundo Real: Se implementaron estados de carga ("Guardando...") y bloqueo de botones para gestionar la latencia de red y evitar peticiones duplicadas.

    Resiliencia: Uso de bloques try/catch para gestionar errores 500 o caídas de servidor, informando al usuario mediante avisos visuales en lugar de dejar la app en un estado inconsistente.




## 6.  Gestión de la Persistencia (Fase D)
El backend utiliza persistencia volátil en memoria RAM. Al estar desplegado en una infraestructura Serverless (Vercel), el contenedor del servidor se apaga tras periodos de inactividad. Esto provoca que el listado de tareas se reinicie. Esta decisión de diseño es intencionada para demostrar una arquitectura 100% basada en API REST sin dependencias de bases de datos externas en esta fase.


Fix de Sincronización de Esquemas: Validación de la conversión de campos del frontend al backend (mapeo de `titulo/prioridad` del cliente a `title/priority` del servidor), garantizando la integridad de la información.

Eliminación de LocalStorage: En script2.js las funciones de guardar en localStorage se borraron o comentaron (//), para que todo dependa de la API.
