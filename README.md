# Taskflow3-Tarea2y1

Intento 3 de proyecto desde cero en VISUAL STUDIO CODE, no en VS 2019.

Nombre del proyecto en github: Taskflow3-Tarea2y1
**GitHub:** https://github.com/JOSU0131/Taskflow3-Tarea2y1
**Vercel:** https://taskflow3-tarea2y1.vercel.app/

---

## Dia 10. Viernes. Paso 8. Ampliar TaskFlow con ayuda de IA

### Funcionalidades añadidas

1. Botón "⊞ Tarjetas" para ver tareas a modo de galería.
Cambios en index.html y script2.js. Commit: `"añadida tarjeta de tareas"`

2. Editar tareas.
    - script2.js: añadir variable `editingTaskId`
    - script2.js: añadir botón editar en `createTaskListItem` y `createTaskCard`
    - script2.js: añadir función `startEditTask`
    - script2.js: actualizar el submit del formulario
    - Corregido fallo en `taskList?.addEventListener` con `closest('.delete-btn')`

3. Calendario real.
    - script2.js: añadir función `renderCalendar`
    - script2.js: llamar `renderCalendar()` en el init
    - index.html: actualizar la sección calendario

4. Notas persistentes.
    - index.html: actualizar la sección notas
    - script2.js: añadir función `setupNotes`
    - script2.js: llamar `setupNotes()` en el init

---

## Dia 11. Lunes. Mejoras de UI/UX y 2ª refactorización

Prompt usado con Claude:

> "Añadir animaciones suaves al crear o eliminar tareas, drag & drop para reordenarlas,
> sistema de prioridades en el panel derecho, ajustar a resoluciones 2K+,
> sidebar más agradable, búsqueda en calendario, header y footer distintos del contenido,
> y cambiar prioridad de tareas con los circulitos.
> ROL: más profesional, coherente y amigable."

### Cambios aplicados

| Mejora | Archivos |
|---|---|
| Animaciones slideIn / slideOut | `index.html`, `script2.js` |
| Drag & drop para reordenar tareas | `script2.js` |
| Circulito de prioridad clickable (Alta → Media → Baja) | `script2.js` |
| Layout 2K/4K con `max-w-8xl` | `index.html` |
| Sidebar rediseñado con gradiente e iconos | `index.html` |
| Header sticky con gradiente | `index.html` |
| Footer oscuro independiente | `index.html` |
| Panel derecho con leyenda de prioridades | `index.html` |
| JSDoc en funciones principales | `script2.js` |
| Tipografía DM Sans + DM Mono | `index.html` |

### Revisión manual pendiente ⚠️
- Verificar IDs entre index.html y script2.js
- Probar dark mode en todos los elementos
- Probar drag & drop en lista y tarjetas

---

## Dia 12. Martes. Corrección de bugs y revisión manual de código

### Bugs corregidos

1. **Calendario no mostraba puntos en días con tareas**
    - script2.js: dentro de `renderCalendar()`, añadir `taskDays` (Set con días del mes que tienen tareas)
    - script2.js: añadir `data-day` a cada celda del calendario
    - script2.js: añadir punto indicador `<span>` cuando `hasTasks === true`

2. **Click en día del calendario no mostraba tareas**
    - index.html: añadir `id="calendarSearch"`, `id="calendarDayTasks"`, `id="calendarDayTitle"`, `id="calendarDayList"` en la sección calendario
    - script2.js: al final de `renderCalendar()`, añadir listener en cada `[data-day]` que filtra tareas por día y las muestra en el panel

3. **Búsqueda del panel derecho no filtraba bien**
    - script2.js: añadir `keydown` con Enter en `searchInput` para forzar `renderTasks()`
    - script2.js: añadir listener en `calendarSearch` que localiza la tarea y salta al día de creación en el calendario

---

## Stack técnico

- HTML5 + Tailwind CSS (CDN)
- JavaScript vanilla (ES6+)
- localStorage para persistencia
- Vercel para despliegue automático desde GitHub