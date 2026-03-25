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

### FASE C — Manejo de errores (MUY importante)

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

    - Ejemplos Prácticos de Interacción con la API REST
        VER Readme FASE C

## Registro de Evolución y Soluciones (Bitácora de Desarrollo)
A continuación, se resumen los pasos realizados y problemas solventados durante esta sesión de desarrollo:

1. Diagnóstico Inicial y Protocolos
Problema: Error de carga de archivos y CORS al usar el protocolo file://.

Solución: Migración a un entorno de servidor local usando la extensión Live Server, permitiendo el uso de módulos de JavaScript.

2. Capa de Red y Modularización
Problema: El código estaba saturado de lógica mezclada y persistencia en LocalStorage.

Solución: Se creó api.js como una capa de abstracción. Se eliminó el uso de LocalStorage para garantizar que la "verdad" de los datos resida únicamente en el Backend.

3. Sincronización de Datos (Mapping)
Problema: Error 400 Bad Request por discrepancia de idiomas en las claves del JSON (ej. titulo vs title).

Solución: Estandarización de los objetos de datos en el frontend para coincidir exactamente con el esquema esperado por el controlador de Express.

4. Implementación del Flujo Completo
Logro: Se verificó el flujo POST → 201 en la terminal de VS Code.

Logro: Se conectó la función deleteTask para realizar peticiones DELETE, confirmando que los cambios persisten tras recargar la página (F5).