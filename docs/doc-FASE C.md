# FASE C Robustez, manejo de excepciones y pruebas de red

## Pruebas y erroers (Frontend - Backend)
Durante la conexión de la interfaz con la API, se identificaron y resolvieron los siguientes obstáculos técnicos:

    Error de CORS y Protocolo: Inicialmente, al abrir el archivo index.html directamente desde el explorador, el navegador bloqueaba las peticiones por políticas de seguridad (CORS).

        Solución: Se utilizó la extensión Live Server de VS Code para servir la aplicación bajo un protocolo http:// estable.

    Conflictos de Módulos (Import/Export): Aparecieron errores de Uncaught SyntaxError: Cannot use import statement outside a module.

        Solución: Se añadió el atributo type="module" en las etiquetas <script> del archivo index.html.

    Duplicidad de Funciones: En el archivo api.js existían declaraciones repetidas de funciones como createTask y deleteTask, lo que causaba que el script dejara de funcionar.

        Solución: Se refactorizó api.js eliminando los imports innecesarios y dejando únicamente las funciones exportables de la API.

    Sincronización de Datos: Se detectó que el frontend enviaba campos en español (titulo, prioridad) mientras el backend esperaba inglés (title, priority).

        Solución: Se ajustaron los objetos JSON en script2.js para asegurar la compatibilidad total con el servidor.

## Pruebas de Integración y Red
Se realizaron pruebas utilizando Thunder Client (o Postman) para forzar errores intencionados y validar la respuesta del servidor:

POST sin título: El servidor responde con un error de validación, evitando que se guarden tareas vacías en la base de datos.

DELETE de tarea inexistente: Al intentar borrar una tarea que no existe, el middleware captura el fallo y devuelve un 404 Not Found, confirmando que el mapeo semántico funciona.

GET y Persistencia: Se confirmó mediante la consola de VS Code que las peticiones devuelven el código 201 al crear y 200 al listar. Al recargar la página, las tareas se mantienen, demostrando que la persistencia en el backend es exitosa.



### Tus respuestas para la Tarea

¿Qué pasa cuando creas una tarea?
Respuesta: La tarea se envía al servidor, el formulario se limpia y la nueva tarea aparece en la lista visualmente.

¿Aparece?
Respuesta: Sí, aparece inmediatamente en la sección "Mis tareas" gracias a que tras el guardado se ejecuta loadTasks().

¿Error?
Respuesta: No hay errores en la consola del navegador; el mensaje de Tailwind es solo una advertencia de optimización que no afecta al flujo.

¿Qué dice la consola del navegador?
Respuesta: No muestra errores rojos. En la pestaña "Network" (Red) se puede ver la petición POST con estado 201 Created.

¿Qué dice la consola del backend?
Respuesta: Dice exactamente POST /api/v1/tasks - 201. 
Esto confirma que el servidor recibió los datos y los procesó correctamente.

## La Prueba de Fuego (Persistencia)
Para poder decir con total seguridad que "Los datos persisten, el GET funciona", haz este último test:

Recarga la página (F5):

Si la tarea que acabas de crear sigue ahí, es porque al cargar la página, tu código ejecutó fetchTasks() hacia el backend y este le devolvió la lista guardada.

**Tras recargar la página, las tareas se mantienen. Esto demuestra que los datos persisten en el servidor y que el método GET funciona correctamente**


## Repasa esto antes de entregar:

POST funciona: Ya lo viste con el 201.
GET funciona: Se confirma si al entrar/recargar ves las tareas.

No hay LocalStorage: Asegúrate de que en script2.js las funciones de guardar en localStorage estén borradas o comentadas, para que todo dependa de la API.

## Pruebas de Eliminar tareas / DELETE

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

## Manejo Global de Excepciones
Para garantizar que el proceso "daemon" de Node.js no muera ante un error, se implementó un middleware de 4 parámetros en `index.js`. Este actúa como una red de seguridad que captura errores de la capa de servicios (como 'NOT_FOUND') y los mapea a códigos HTTP semánticos, protegiendo la integridad del servidor.

## Documentación de colección de errores intencionados
###  Pruebas de Integración (Thunder Client)

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

        Respuesta en terminal de server: [POST] /api/v1/tasks/ - 201 (1ms)
        El servidor procesó la entrada, asignó un ID único de forma automática y respondió con el código "201 Created", confirmando la persistencia del recurso en la memoria

    Para su eliminacion exitosa, se visualizó su id mediante un GET, URL: http://localhost:3000/api/v1/tasks + SEND. Y la eliminación se realizo mediante un DELETE, URL: http://localhost:3000/api/v1/tasks/1774625429648 + SEND. 

    El servidor procesó la solicitud correctamente y respondió con el código "204 No Content", lo que indica que la acción se completó con éxito y no hay contenido adicional que devolver. 

    **BONUS**, al solicitar otro GET en misma URL, salio "Status: 200 OK", lo que indica que el borrado fue un exito y no hay contenido adicional que devolver.





### RESUMEN GLOBAL DE PRUEBAS

| Escenario            | Método    | Resultado      | Comportamiento esperado |
| :---                 | :---      | :---           | :--- |
| **POST sin título**  | `POST` | `400 Bad Request` | El controlador detiene la petición antes de llegar al servicio. |

| **DELETE ID falso**  | `DELETE` | `404 Not Found` | El servicio lanza un error que el middleware global traduce a 404.  |

| **GET General**      | `GET`    | `200 OK`        | Se recuperan las tareas de la memoria de forma exitosa. |
