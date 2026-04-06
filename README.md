# Proyecto Taskflow: Arquitectura Cliente-Servidor (API REST)

**Readme.md sobre la visión general para el usuario (Raíz)**


**NOTA ⚠️**  **Enlace README del Backend:**
*Para detalles técnicos sobre la implementación del servidor, las distintas FASES y documentación exhaustiva consulta el README de la carpeta server.*


**VISIÓN GENERAL (antes de empezar)**
Este proyecto representa la transición de una aplicación monolítica con persistencia local hacia una arquitectura desacoplada Cliente-Servidor, utilizando una API REST construida en Node.js/Express.

## Principios del diseño:

- Separación de responsabilidades (SoC)
- Arquitectura por capas
- Gestión centralizada de errores
- Configuración desacoplada (env vars)
- API REST semántica (HTTP correcto)
- Código mantenible y testeable

### FASE A -  Infraestructura y variables de entorno

### FASE B -  Ingeniería del dominio y arquitectura por capas en JavaScript

### FASE C -  Documentación de la API y Manejo de errores

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

### Pruebas de Eliminar tareas / DELETE

¿Qué pasa cuando eliminas una tarea?

Probé a hacer Delete, en mi web aparece como "eliminar" o "X" en la tarea, y en la terminal del backend salia el mensaje "[POST] /api/v1/tasks - 201 (0ms)", lo que significabas que la orden de "borrar" no está llegando al servidor. Y además persistian las tareas.

tuve que buscar en script2.js y reemplazar el codigo por:

**NOTA**
    *"Durante las pruebas, detecté que el borrado fallaba porque el frontend usaba IDs locales. Refactoricé el código para que el cliente espere al servidor y utilice únicamente el ID oficial, asegurando que la orden DELETE llegue al recurso correcto."*


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


#### Documentación de colección de errores intencionados

Se han realizado pruebas exhaustivas utilizando **Thunder Client** para asegurar la robustez de la API (validar las respuestas del servidor):

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

Duplicidad de Funciones: En el archivo api.js existían declaraciones repetidas de funciones como createTask y deleteTask, lo que causaba que el script dejara de funcionar.

        Solución: Se refactorizó api.js eliminando los imports innecesarios y dejando únicamente las funciones exportables de la API.

### Bonus - Gestión de estados de red en UI
    Se ha refactorizado la interfaz para gestionar la "física del mundo real":

    Estado de Carga: Al añadir tareas, el botón muestra "Guardando..." y se deshabilita para evitar peticiones duplicadas.

    Estado de Éxito: La UI se actualiza instantáneamente tras recibir el 201 Created del servidor, sin necesidad de refrescar.

    Estado de Error: Implementación de bloques try/catch que lanzan avisos visuales si el servidor no responde o devuelve un error 500.


### FASE D -  Transparencia de red y consumo desde el frontend


### 3. Bitácora de Desarrollo (Último paso)
En tu sección de "Registro de Evolución", añade un punto número 5:

Problema: Error 404 en el despliegue de Vercel debido a la estructura de subcarpetas.

Solución: Implementación de un archivo de configuración vercel.json en la raíz para redirigir el tráfico hacia el punto de entrada del servidor en /server/index.js
   
Problemas Identificados y Resueltos:

Sincronización de IDs (Frontend vs Backend):

Fallo: El frontend generaba IDs temporales con Date.now(), mientras que el servidor asignaba sus propios IDs en memoria. Esto causaba errores 404/500 al intentar borrar tareas recién creadas.

Solución: Se refactorizó la lógica de creación para que el frontend espere la respuesta oficial del servidor y use el ID devuelto por Node.js.

Renderizado Asíncrono (El fallo de la "vista"):

Fallo: Al añadir una tarea, el tutor no la veía al instante porque el código no disparaba el re-renderizado automático tras el POST. Solo se veía al cambiar manualmente de sección.

Solución: Se integró la llamada a renderTasks() dentro del bloque de éxito (try/await) del formulario, garantizando una UI reactiva.

Transparencia de Red y Estados (Fase D):

Se implementó el manejo de Promesas para gestionar la latencia.

Carga: Bloqueo de botones y placeholders visuales durante las peticiones.

Error: Captura de excepciones de red para evitar que la App se quede "congelada" ante fallos del servidor.

Persistencia Volátil (Vercel):

Se aclara que, al no utilizar una base de datos persistente (MongoDB), los datos residen en la memoria RAM del proceso de Node.js. En Vercel (Serverless), esto implica que las tareas se reinician tras periodos de inactividad.        

####  FASE BONUS. Solución del Despliegue en Vercel (no funciono falto el ultimo paso ver bitacora/registro de fallos punto 6 y 7)
Uno de los mayores desafíos fue el despliegue en Vercel, no conseguia encontrar la solución y la IA (gemini) no paraba de dar soluciones en bucle.

 Aquí resumo los pasos que dieron la solución final:

El problema del 404: Inicialmente, Vercel no encontraba la aplicación porque el archivo index.html estaba escondido en subcarpetas (client/src).

La Solución Estructural: - Eliminé la carpeta client y moví el index.html, api.js y script2.js a la raíz del proyecto.

Esto permitió que Vercel detectara el punto de entrada de la web de forma automática.

Configuración de Rutas (vercel.json): Implementé rewrites para redirigir todo el tráfico de /api/* hacia nuestro servidor en /server/index.js.

Sincronización de IDs: Corregí un fallo donde el borrado fallaba en la nube. El frontend intentaba borrar con un ID inventado, pero ahora espera el ID oficial que genera el servidor tras el POST.

**BONUS**
Servidor de Archivos Estáticos: En el index.js local, configuré app.use(express.static(path.join(__dirname, '../../'))) para que el servidor Node pudiera servir la web en localhost:3000 exactamente igual que lo hace Vercel.



### Registro de Evolución y Soluciones (Bitácora de Desarrollo)
A continuación, se resumen los pasos realizados y problemas solventados durante esta sesión de desarrollo:

1. Diagnóstico Inicial y Protocolos
Problema: Error de carga de archivos y CORS al usar el protocolo.

Solución: Migración a un entorno de servidor local usando la extensión Live Server, permitiendo el uso de módulos de JavaScript.

Tuve que añadir en index.js "app.use(cors())" para permitir la comunicación entre el puerto 5500 (web) y el 3000 (servidor).

**NOTA**    
    *"Finalmente, se configuró el servidor Express para servir archivos estáticos, permitiendo probar la app completa en el puerto 3000 sin depender de extensiones externas."*

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


6. Solución Definitiva de Despliegue (Vercel):

Problema: El proyecto lanzaba un error 404 en Vercel porque la estructura de carpetas era demasiado profunda (client/src).

Solución: Simplifiqué la arquitectura eliminando la carpeta client y moviendo el index.html a la raíz. Además, configuré un archivo vercel.json con rewrites para que todas las peticiones a /api se redirijan correctamente al servidor Node.js. Esto permitió que la app fuera accesible públicamente sin errores de ruta.  

7. Fallo de MIME type en Despliegue:

Problema: Al mover archivos a la raíz, la configuración de rewrites de Vercel enviaba el contenido de index.html cuando el navegador pedía archivos .js, causando un error de "Expected a JavaScript module script but the server responded with a MIME type of text/html".

Solución: Se ajustó vercel.json para que las rutas estáticas se resuelvan correctamente sin ser interceptadas por la redirección global del HTML.
