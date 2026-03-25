# FASE D Información sobre Axios, Postman, Sentry, swagger

## Investigación Tecnológica: Ecosistema de APIs
En el desarrollo de aplicaciones modernas, el uso de herramientas de terceros es vital para garantizar la eficiencia, la seguridad y la escalabilidad del software. A continuación, se detallan las herramientas clave solicitadas en la Fase D:

1. Axios
¿Qué es? Es una librería cliente HTTP basada en promesas para el navegador y Node.js. Es la alternativa más popular a la API nativa fetch.

¿Por qué se usa?

Transformación automática: Convierte automáticamente los datos a JSON (en fetch hay que hacer .json() manualmente).

Interceptores: Permite ejecutar código antes de que una petición se envíe o antes de que una respuesta llegue (muy útil para añadir tokens de seguridad).

Manejo de errores: Captura de forma más sencilla los errores de red y códigos de estado (4xx y 5xx).

2. Postman / Thunder Client
¿Qué son?
Son plataformas para el desarrollo y prueba de APIs. Postman es una aplicación independiente, mientras que Thunder Client es una extensión ligera integrada en Visual Studio Code.

¿Por qué se usan?

Pruebas aisladas: Permiten probar si el Backend funciona correctamente sin necesidad de haber escrito ni una sola línea de código en el Frontend.

Documentación: Ayudan a generar colecciones de peticiones que sirven como guía para otros desarrolladores.

Automatización: Permiten crear tests automáticos para verificar que los endpoints devuelven los datos correctos.

3. Sentry
¿Qué es?
Es una plataforma de monitoreo de errores y rendimiento en tiempo real (error tracking).

¿Por qué se usa?

Visibilidad en producción: Cuando una aplicación ya está publicada y un usuario tiene un error, Sentry captura el fallo y envía un informe detallado al programador.

Traza del error: Indica exactamente en qué línea de código ocurrió el fallo y qué estaba haciendo el usuario en ese momento.

Prevención: Ayuda a corregir errores antes de que afecten a un gran número de usuarios.

4. Swagger (OpenAPI)
¿Qué es?
Es un conjunto de herramientas para diseñar, construir y, sobre todo, documentar APIs REST bajo el estándar OpenAPI.

¿Por qué se usa?

Documentación Interactiva: Genera una página web automática donde cualquier persona puede ver qué rutas tiene la API, qué parámetros necesita y qué respuestas devuelve.

Consola de pruebas: Permite "probar" la API directamente desde el navegador sin usar Postman.

Contrato técnico: Sirve como el "contrato" oficial entre el equipo que hace el Backend y el que hace el Frontend.