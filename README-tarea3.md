# VISIÓN GENERAL (antes de empezar)
Este proyecto representa la transición de una aplicación monolítica con persistencia local hacia una arquitectura desacoplada Cliente-Servidor, utilizando una API REST construida en Node.js/Express.

## Principios del diseño:

- Separación de responsabilidades (SoC)
- Arquitectura por capas
- Gestión centralizada de errores
- Configuración desacoplada (env vars)
- API REST semántica (HTTP correcto)
- Código mantenible y testeable


### Fase A -  Infraestructura y variables de entorno
    Objetivo
    Configurar el entorno del servidor de forma flexible y segura.
    - Uso de variables de entorno (.env)
    - Configuración del servidor desacoplada del código
    - Uso de dotenv

### FASE B -  Ingeniería del dominio y arquitectura

Vas a construir una API así:

    index.js → arranca servidor
    routes → define rutas (/tasks)
    controllers → validan datos HTTP
    services → lógica pura (sin Express)

### FASE C -  Documentación de la API y Manejo de errores

#### Pruebas de Integración y Red
Se realizaron pruebas utilizando Thunder Client para forzar errores intencionados y validar la respuesta del servidor:

No hay LocalStorage: Asegúrate de que en script2.js las funciones de guardar en localStorage estén borradas o comentadas, para que todo dependa de la API.

#### Pruebas de Eliminar tareas / DELETE

¿Qué pasa cuando eliminas una tarea?

Probé a hacer Delete, en mi web aparece como "eliminar" o "X" en la tarea, y en la terminal del backend salia el mensaje "[POST] /api/v1/tasks - 201 (0ms)", lo que significabas que la orden de "borrar" no está llegando al servidor. Y además persistian las tareas.

tuve que buscar en script2.js y reemplazar el codigo por:

     if (deleteBtn) {
    const taskId = deleteBtn.dataset.id;
    const item = taskList.querySelector(`[data-id="${taskId}"]`);
    
    if (item) {
        item.classList.add('tarea-sale');
        item.addEventListener('animationend', async () => {
            try {
                // 2. Llamamos a la API para borrar en el servidor
                await deleteTask(taskId); 
                // 3. Recargamos la lista desde el servidor para confirmar
                await loadTasks(); 
            } catch (error) {
                console.error("Error al borrar:", error);
                alert("No se pudo borrar la tarea del servidor");
            }
        }, { once: true });
        }
    }

Despues de reemplazar el codigo, se corrigio los fallos, el POST y el de persistencia
En el terminal backend, funcionaba correctamente y aparecia el mensaje:
  DELETE /api/v1/tasks/ID - 204 (o 200).

#### Manejo Global de Excepciones
Para garantizar que el proceso "daemon" de Node.js no muera ante un error, se implementó un middleware de 4 parámetros en `index.js`. Este actúa como una red de seguridad que captura errores de la capa de servicios (como 'NOT_FOUND') y los mapea a códigos HTTP semánticos, protegiendo la integridad del servidor.

#### Documentación de colección de errores intencionados

Pruebas de Integración en Thunder Client

    - Creación de tarea Exitosa (POST)
    Se realizó una petición POST enviando un objeto JSON con un título válido "ORCOS".
    Se envió un JSON { "title": "ORCOS" } al endpoint /api/v1/tasks. El servidor respondió con un código STATUS: "201 Created", confirmado en la terminal de VS Code backend server como "[POST] /api/v1/tasks - 201."
        
        Body JSON
            {
            "title": "ORCOS"
            }

            Respuesta: Status: 201 Created
                {
                "id": "1774626427865",
                "title": "ORCOS",
                "completed": false
                }
            El servidor procesó la entrada, asignó un ID único de forma automática y respondió con el código "201 Created", confirmando la persistencia del recurso en la memoria

    - Validación de Frontera (POST vacío)
    Se verifica que el controlador actúa como un filtro de seguridad. Al realizar una petición POST con un Body vacío ({}) y con Body (sin nada), el servidor rechaza la entrada con un código "400 Bad Request", evitando la persistencia de datos corruptos o incompletos.
    
    El servidor THUNDER respondió con Status: "400 Bad Request", demostrando que el controlador bloquea datos inválidos y el API ahora es "Inexpugnable".

    Respuesta del servidor:
        JSON
        {
        "error": "El título es obligatorio, debe ser un texto y tener al menos 3 caracteres."
        }
    
    Respuesta en terminal de server: "[POST] /api/v1/tasks - 400 (3ms)"


    - Borrado de recurso Inexistente (DELETE 404)
    Se intentó eliminar la tarea inexistene con ID "tasks/999999". El servidor respondió con codigo "404 Not Found", confirmando que el middleware global de errores captura y mapea correctamente las excepciones.

    Respuesta del servidor:
        JSON
        {
        "error": "Recurso no encontrado"
        }

    Respuesta en terminal de server: "[DELETE] /api/v1/tasks/999999 - 404 (1ms)"


    - Borrado Exitoso (DELETE 204)
    Se realizó la eliminación de una tarea válida previamente creada  (ID "1774625429648", título "ORCOS"). Creada con petición POST url: http://localhost:3000/api/v1/tasks/

    Para su eliminacion exitosa, se visualizó su id mediante un GET, URL: http://localhost:3000/api/v1/tasks + SEND. Y la eliminación se realizo mediante un DELETE, URL: http://localhost:3000/api/v1/tasks/1774625429648 + SEND. 

    El servidor procesó la solicitud correctamente y respondió con el código "204 No Content", lo que indica que la acción se completó con éxito y no hay contenido adicional que devolver. 

    **BONUS**, al solicitar otro GET en misma URL, salio "Status: 200 OK", lo que indica que el borrado fue un exito y no hay contenido adicional que devolver.


### FASE D — Documentación Arquitectónica

Arquitectura de Carpetas
Se ha elegido una estructura clara que separa las responsabilidades del código (Separation of Concerns):

    /root
    ├── /server (Backend)
    │   ├── index.js          # Punto de entrada del servidor Express y Middlewares
    │   └── package.json      # Dependencias (Express, Cors, Nodemon)
    └── /client (Frontend)
        ├── /src
        │   ├── api.js        # Capa de Red (Abstracción de peticiones Fetch)
        │   ├── script2.js    # Lógica de Negocio y Manipulación del DOM
        │   └── style.css     # Estilos visuales
        └── index.html        # Estructura principal y carga de módulos

    - Funcionamiento de Middlewares (Terminología Técnica)

        El servidor utiliza Middlewares para procesar las peticiones antes de que lleguen a las rutas finales:

        CORS (Cross-Origin Resource Sharing): Fundamental para permitir que el frontend (ej. puerto 5500) tenga permiso para solicitar recursos al backend (puerto 3000). Sin este middleware, el navegador bloquea la conexión por seguridad.

        express.json(): Un "parser" que analiza el cuerpo de las peticiones entrantes. Convierte el flujo de datos binarios en un objeto JavaScript accesible mediante req.body.

        Middleware de Manejo de Errores (Global): Implementado con 4 parámetros (err, req, res, next). Captura cualquier excepción en el flujo de ejecución, loguea el error en el servidor y devuelve una respuesta HTTP controlada (500) al cliente, evitando fugas de información técnica sensible.


Arquitectura Desacoplada: Explica que el proyecto sigue un modelo de separación donde el cliente y el servidor residen en directorios distintos.

Configuración de Despliegue: Menciona que has utilizado rewrites en Vercel para mapear las rutas de la API hacia la carpeta /server.

Ejemplos de Interacción Real: Actualiza tus ejemplos de la Fase C con la URL real de Vercel. Por ejemplo:

GET: https://taskflow3-tarea2y1.vercel.app/api/v1/tasks.

3. Bitácora de Desarrollo (Último paso)
En tu sección de "Registro de Evolución", añade un punto número 5:

Problema: Error 404 en el despliegue de Vercel debido a la estructura de subcarpetas.

Solución: Implementación de un archivo de configuración vercel.json en la raíz para redirigir el tráfico hacia el punto de entrada del servidor en /server/index.js
   
        

### FASE BONUS. Configuración de Vercel


## Registro de Evolución y Soluciones (Bitácora de Desarrollo)
A continuación, se resumen los pasos realizados y problemas solventados durante esta sesión de desarrollo:

1. Diagnóstico Inicial y Protocolos
Problema: Error de carga de archivos y CORS al usar el protocolo.

Solución: Migración a un entorno de servidor local usando la extensión Live Server, permitiendo el uso de módulos de JavaScript.

Tuve que añadir en index.js "app.use(cors())" para permitir la comunicación entre el puerto 5500 (web) y el 3000 (servidor).

2. Capa de Red y Modularización
Problema: El código estaba saturado de lógica mezclada y persistencia en LocalStorage.

Solución: Se creó api.js como una capa de abstracción. Se eliminó el uso de LocalStorage para garantizar que la "verdad" de los datos resida únicamente en el Backend.

3. Sincronización de Datos (Mapping)
Problema: Error 400 Bad Request por discrepancia de idiomas en las claves del JSON (ej. titulo vs title).

Solución: Estandarización de los objetos de datos en el frontend para coincidir exactamente con el esquema esperado por el controlador de Express.

4. Implementación del Flujo Completo
Logro: Se verificó el flujo POST → 201 en la terminal de VS Code.

Logro: Se conectó la función deleteTask para realizar peticiones DELETE, confirmando que los cambios persisten tras recargar la página (F5).

5. Pruebas y erroers (Frontend - Backend)

Durante la conexión de la interfaz con la API, se identificaron y resolvieron los siguientes obstáculos técnicos:

Error de CORS y Protocolo: Inicialmente, al abrir el archivo index.html directamente desde el explorador, el navegador bloqueaba las peticiones por políticas de seguridad (CORS).

        Solución: Se utilizó la extensión Live Server de VS Code para servir la aplicación bajo un protocolo http:// estable.

Conflictos de Módulos (Import/Export): Aparecieron errores de Uncaught SyntaxError: Cannot use import statement outside a module.

        Solución: Se añadió el atributo type="module" en las etiquetas <script> del archivo index.html.

Duplicidad de Funciones: En el archivo api.js existían declaraciones repetidas de funciones como createTask y deleteTask, lo que causaba que el script dejara de funcionar.

        Solución: Se refactorizó api.js eliminando los imports innecesarios y dejando únicamente las funciones exportables de la API.

Sincronización de Datos: Se detectó que el frontend enviaba campos en español (titulo, prioridad) mientras el backend esperaba inglés (title, priority).

        Solución: Se ajustaron los objetos JSON en script2.js para asegurar la compatibilidad total con el servidor.