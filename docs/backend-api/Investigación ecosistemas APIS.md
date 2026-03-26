// FASE D. Paso 5. Investigación sobre Axios, Postman, Sentry, swagger

# Investigación Tecnológica: Ecosistema de APIs

Herramientas estándar del sector para desarrollar, probar, monitorear y documentar APIs REST. Y para garantizar la eficiencia, la seguridad y la escalabilidad del software. 

## 1. Axios

Es una **librería cliente HTTP** basada en promesas para el navegador y Node.js. Es la alternativa más popular a la API nativa `fetch`.

- Ventajas y **¿Por qué se usa?**

    Transformación automática: Convierte automáticamente los datos a JSON (en fetch hay que hacer .json() manualmente, es decir "llamar manualmente").

    Interceptores: Permite ejecutar código antes de que una petición se envíe o antes de que una respuesta llegue (muy útil para añadir tokens de seguridad y de autenticación).

    Manejo de errores: Captura errores de red y códigos `4xx`/`5xx` de forma más sencilla que `fetch`

    Cancelación de peticiones: Permite cancelar una petición en vuelo si el usuario navega a otra página

    **Comparativa con `fetch`:**

    En JS
    // Con fetch — hay que hacer .json() manualmente y gestionar errores a mano
    const res = await fetch('/api/tasks');
    if (!res.ok) throw new Error('Error');
    const data = await res.json();

    // Con Axios — más conciso y errores automáticos
    const { data } = await axios.get('/api/tasks');
    ```

    **¿Cuándo usarlo?**
    En proyectos medianos o grandes donde se necesita interceptar peticiones, gestionar tokens o centralizar el manejo de errores de red.


## 2. Postman / Thunder Client

Son plataformas para el desarrollo y prueba de APIs REST. 

- **Postman** — aplicación independiente, muy completa, estándar en empresas
- **Thunder Client** — es una extensión ligera de VS Code, ideal para desarrollo rápido

- Ventajas y **¿Por qué se usa?**

    Pruebas aisladas: Permiten probar el Backend sin necesidad de escribir código en el Frontend.

    Genera Documentación mas facilmente: Ayudan a generar colecciones de peticiones relacionadas que sirven como guía para otros desarrolladores.

    Variables de entorno: Permiten cambiar entre `localhost` y producción con un clic.

    Automatización: Permiten crear tests automáticos para verificar que los endpoints devuelven los datos correctos.

    Colaboración: Las colecciones se pueden compartir con el equipo


**Usado en este task-flow**
        Thunder Client para probar los endpoints durante el desarrollo:
        ```
        GET    /api/v1/tasks        → 200 ✅
        POST   /api/v1/tasks        → 201 ✅
        POST   /api/v1/tasks (vacío)→ 400 ✅
        DELETE /api/v1/tasks/:id    → 204 ✅
        DELETE /api/v1/tasks/999    → 404 ✅
        ```

## 3. Sentry
Es una plataforma de monitoreo de errores y rendimiento en tiempo real (error tracking). Captura fallos en producción y los envía al equipo de desarrollo con todo el contexto necesario para reproducirlos.


- Ventajas y **¿Por qué se usa?**
    Visibilidad en producción: Cuando una aplicación ya está publicada y un usuario tiene un error, Sentry captura el fallo y envía un informe detallado al programador.

    Traza del error: Indica exactamente en qué línea de código ocurrió el fallo y qué estaba haciendo el usuario en ese momento (Contexto del usuario).

    Prevención: Ayuda a corregir errores antes de que afecten a otros usuarios.
    Rendimiento: Mide tiempos de respuesta y detecta cuellos de botella

**¿Por qué no valdria solo con `console.error()`?**
`console.error()` solo funciona si tienes acceso a los logs del servidor. En producción con miles de usuarios, necesitas una herramienta que agregue, filtre y priorice errores automáticamente.

**Integración básica en Express:**
```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://tu-clave@sentry.io/proyecto' });
app.use(Sentry.Handlers.errorHandler());
```


## 4. Swagger (OpenAPI). IMPORTANTE
Conjunto de herramientas para diseñar, construir y documentar APIs REST bajo el estándar **OpenAPI**. Genera una página web interactiva con toda la documentación de la API.

- Ventajas y **¿Por qué se usa?**

    Documentación Interactiva: Genera una página web automática donde cualquier persona puede ver qué rutas tiene la API, qué parámetros necesita y qué respuestas devuelve.

    Consola de pruebas: Permite "probar" la API directamente desde el navegador sin usar Postman.

    Contrato técnico: Sirve como el "contrato" oficial entre el equipo que hace el Backend y el que hace el Frontend.

    Generación de código: Puede generar automáticamente clientes de API en distintos lenguajes

    Estándar de la industria:  OpenAPI es el estándar más usado para documentar APIs en empresas 
---

## Resumen — ¿Cuándo usar cada herramienta?

| Herramienta   | Fase del proyecto | Para qué |

| Axios         | Frontend          | Hacer peticiones HTTP de forma robusta |
| Thunder Client| Desarrollo        | Probar endpoints mientras programas |
| Postman       | Desarrollo / QA   | Pruebas, documentación y colaboración en equipo |

| Swagger       | Producción        | Documentar la API para otros desarrolladores |
| Sentry        | Producción        | Monitorear errores reales de usuarios |