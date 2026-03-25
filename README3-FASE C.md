# FASE C Robustez, manejo de excepciones y pruebas de red

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
Respuesta: Dice exactamente POST /api/v1/tasks - 201. Esto confirma que el servidor recibió los datos y los procesó correctamente.

### La Prueba de Fuego (Persistencia)
Para poder decir con total seguridad que "Los datos persisten, el GET funciona", haz este último test:

Recarga la página (F5):

Si la tarea que acabas de crear sigue ahí, es porque al cargar la página, tu código ejecutó fetchTasks() hacia el backend y este le devolvió la lista guardada.

**Tras recargar la página, las tareas se mantienen. Esto demuestra que los datos persisten en el servidor y que el método GET funciona correctamente**


### Repasa esto antes de entregar:

POST funciona: Ya lo viste con el 201.

GET funciona: Se confirma si al entrar/recargar ves las tareas.

No hay LocalStorage: Asegúrate de que en script2.js las funciones de guardar en localStorage estén borradas o comentadas, para que todo dependa de la API.

DELETE