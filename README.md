# Taskflow. Fase 3: Arquitectura Cliente-Servidor (API REST)

**Nota ⚠️: Este es un Readme.md (Raiz) sobre la visión general para el usuario**
**Nota ⚠️: Para ver el Readme exhaustivo**
*Para más detalles técnicos sobre la implementación del servidor, las distintas FASES y documentación exhaustiva consulta el README.md -backend de la carpeta server.*


**Aplicación de gestión de tareas — evolución de frontend monolítico a arquitectura Cliente-Servidor desacoplada.**

**GitHub:** https://github.com/JOSU0131/Taskflow3-Tarea2y1
**Vercel:** https://taskflow3-tarea2y1.vercel.app/

---

## ¿Qué es este proyecto?

Taskflow es una aplicación de gestión de tareas construida en tres fases progresivas que representan la evolución de un desarrollador frontend hacia el fullstack:

| Fase | Tecnología | Qué se aprendió |
|---|---|---|
| Fase 1 | HTML + CSS + JS + LocalStorage | DOM, eventos, persistencia local |
| Fase 2 | Tailwind CSS + IA | Refactoring, UI/UX, dark mode, animaciones |
| Fase 3 | Node.js + Express + API REST | Backend, arquitectura por capas, fetch, despliegue |

---

## Principios del diseño:

- Separación de responsabilidades (SoC)
- Arquitectura por capas
- Gestión centralizada de errores
- Configuración desacoplada (env vars)
- API REST semántica (HTTP correcto)
- Código mantenible y testeable


## Arquitectura del sistema
...
Taskflow3-Tarea2y1/
├── vercel.json             ← configuración de rutas para Vercel
├── index.html              ← frontend — estructura principal
├── api.js                  ← capa de red (abstracción fetch)
├── script2.js              ← lógica de negocio y DOM
├── *client/*       *NOTA*  ← assets del frontend
└── server/                 ← backend Express
    └── src/
        ├── index.js        ← punto de entrada del servidor
        ├── config/
        ├── routes/
        ├── controllers/
        └── services/
└── docs/                   ← Pruebas Fase C y docs: investigación backend-api

*NOTA: eliminado por problemas con vercel, ver bitacora*
...

## Flujo de datos

```
Antes (Fase 1 y 2):
Navegador → LocalStorage
(datos locales, no persistentes entre dispositivos)

Ahora (Fase 3):
Navegador → api.js → fetch() → Express API → Array en memoria
(datos centralizados en el servidor)
```

---

## Cómo ejecutar en local

**Frontend:**
Abre con Live Server en VS Code — necesario para evitar errores de CORS con `file://`.

**Backend:**
```bash
cd server
npm install
npm run dev
```

El servidor arranca en `http://localhost:3000`.

El frontend apunta a `http://localhost:3000/api/v1/tasks` — asegúrate de que el servidor esté corriendo antes de usar la app.

---

## Despliegue en Vercel

El proyecto está desplegado con una configuración especial en `vercel.json` que resuelve las rutas del backend como Serverless Functions y sirve el frontend de forma estática.

**Nota sobre persistencia:** Al estar en infraestructura Serverless, el array de tareas en memoria se reinicia cuando el contenedor se apaga por inactividad. Esta es una limitación conocida e intencionada en esta fase — la solución real sería conectar una base de datos persistente (MongoDB, PostgreSQL).

---

## Documentación detallada

| Documento | Contenido |
|---|---|
| `server/Readme.md` | Arquitectura backend, middlewares, endpoints, pruebas |
| `README.md`         | Visión general, fases, bitácora de errores, Pruebas Thunder Client, errores y soluciones |
| `docs/doc-FASE C`       | Robustez, manejo de excepciones y pruebas de red |
| `docs/backend-api.md`   | Investigación: Axios, Postman, Sentry, Swagger |

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| HTML5 + Tailwind CSS | Frontend |
| JavaScript ES6+ (módulos) | Lógica cliente |
| Node.js | Entorno de ejecución servidor |
| Express 4.x | Framework HTTP |
| cors + dotenv | Seguridad y configuración |
| nodemon | Desarrollo con recarga automática |
| Vercel | Despliegue frontend + backend |
| Thunder Client | Pruebas de endpoints |

---


