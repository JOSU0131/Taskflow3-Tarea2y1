# Taskflow3-Tarea2y1

    Intento 3. de proyecto desde cero en VISUAL STUDIO CODE, no en VS 2019, el que estaba usando antes.

    Nombre del nuevo proyecto en github: Taskflow3-Tarea2y1
    **GitHub:** https://github.com/JOSU0131/Taskflow3-Tarea2y1 
    **Vercel:**: https://github.com/JOSU0131/Taskflow3-Tarea2y1


## Dia 10. Viernes. Paso 8. Ampliar TaskFlow con ayuda de IA

### Funcionalidades añadidas
        1. Nueva funcionalidad. Botón "⊞ Tarjetas", para ver tareas a modo de galeria. 
        Nota: Procedo a compara el codigo y a editar. Cambios en codigo de index.html y script2. Comit: "-m "añadida tarjeta de tareas"
            
        2. Nueva funcionalidad. Editar tareas
        Nota: Procedo a compara el codigo y a editar. 
            En script2.js añadir variable editingTaskId
            Tambien en script2.js añadir botón editar en createTaskListItem
            Añadir botón editar en createTaskCard
            Añadir función startEditTask
            Actualizar el submit del formulario
            Corregido fallos en: "taskList?.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-btn');"

        3. Nueva funcionalidad añadir Calendario real
        Nota: Procedo a compara el codigo y a editar con ayuda de IA claude
            Cambio 1 — script2.js: añadir función renderCalendar
            Cambio 2 — script2.js: llamar renderCalendar() en el init
            Cambio 3 — index.html: actualizar la sección calendario

        4. Funcionalidad Notas persistentes
        Nota: Procedo a compara el codigo y a editar con ayuda de IA claude
            Cambio 1 — en index.html: actualizar la sección notas
            Cambio 2 — en script2.js: añadir función setupNotes
            Cambio 3 — en script2.js: llamar setupNotes() en el init


## Dia 11. Lunes. Mejoras de UI/UX y 2ª refactorización

        **mejoras en la interfaz y experiencia del usuario**

- Prompt usado con Claude (IA)

    > "Tengo que añadir animaciones suaves al crear o eliminar tareas,
    > implementar un drag & drop para reordenarlas, crear un pequeño sistema
    > de categorías o prioridades para cada tarea (en la parte de la derecha),
    > ajustar la web a resoluciones de 2K o superior aprovechando mejor el espacio
    > (manteniendo la adaptabilidad a la versión móvil), hacer el desplegable izquierdo
    > (sidebar) más agradable estéticamente, búsqueda basada en el calendario,
    > que el footer y el header no se mezclen y se distingan bien,
    > y la posibilidad de cambiar la prioridad de las tareas manualmente
    > (aprovechando los circulitos).
    > ROL: que todo se vea más profesional, coherente y estéticamente amigable."

### Cambios aplicados

 Mejora | Archivos afectados |
|---|---|
| Animaciones slideIn / slideOut al crear y eliminar tareas | `index.html`, `script2.js` |
| Drag & drop para reordenar tareas | `script2.js` |
| Circulito de prioridad clickable (cicla Alta → Media → Baja) | `script2.js` |
| Layout 2K/4K con `max-w-8xl` y media query 2560px | `index.html` |
| Sidebar rediseñado con gradiente, iconos y contador de tareas | `index.html` |
| Búsqueda en calendario por texto — localiza el día de creación | `script2.js` |
| Header sticky con gradiente, claramente separado del contenido | `index.html` |
| Footer oscuro independiente, distinto del body | `index.html` |
| Panel derecho con leyenda de prioridades | `index.html` |
| JSDoc en todas las funciones principales | `script2.js` |
| Tipografía DM Sans + DM Mono (Google Fonts) | `index.html` |


## Stack técnico

- HTML5 + Tailwind CSS (CDN)
- JavaScript vanilla (ES6+)
- localStorage para persistencia
- Google Fonts: DM Sans + DM Mono
- Vercel para despliegue automático desde GitHub

FALTA REVISION MANUAL