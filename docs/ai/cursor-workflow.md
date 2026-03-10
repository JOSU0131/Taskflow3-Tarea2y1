# TAREA
    Instala Cursor y abre el proyecto TaskFlow  DONE

    Explora la interfaz: explorador de archivos, terminal integrada, chat y herramientas de edición
    Prueba el autocompletado escribiendo comentarios que describan funciones
    Utiliza el chat contextual para pedir explicaciones de partes del código
    Utiliza la edición inline para modificar funciones existentes
    Prueba Composer para generar cambios que afecten a varios archivos

    Anota en "docs/ai/cursor-workflow.md" los atajos de teclado que uses con más frecuencia

    Documenta dos ejemplos concretos donde Cursor haya mejorado tu código

- Algunas sugerencias

    Los 3 atajos principales de IA

    Atajo	Qué hace
    Ctrl + K	Edita o genera código en el archivo actual
    Ctrl + L	Abre el panel de chat de IA (puedes preguntar cualquier cosa)
    Ctrl + Shift + L	Selecciona código y abre el chat para preguntar sobre él


- Lo que cambio cursor en mi primer "taskflow"

    What I changed for you
    Cleaned up index.ngl.html:

    Removed duplicate taskList IDs and old inline handlers (addTask(), filterTasks()), and built a single, clean task form that matches Script2.js (taskForm, newTaskTitle, newTaskCategory, newTaskPriority, taskList).
    Organized the layout into a clear structure: sidebar + main content (tasks / calendar / notes) + an aside with search, category filters, and “Novedades recientes” (recentTasksCount, recentTasksList, moreRecentTasksContainer, moreRecentTasksList) that your JS expects.
    Fixed the sidebar and section switching in Script2.js:

    Added logic to open/close the sidebar via menuToggle and closeMenu, toggling the sidebar.active class your CSS already styles.
    Implemented showSectionInternal and exposed it as window.showSection, so the sidebar links correctly toggle between Tareas / Calendario / Notas.

    Hooked in Tailwind (bonus):

    Added the Tailwind CDN in <head> and sprinkled a few utility classes (e.g. bg-slate-100, shadow-lg, flex layout on main, spacing on the aside) so you now have Tailwind utilities available on top of your existing CSS without breaking anything.

- Cambios/ideas para recordar
    <main>
        <!-- Filtro por prioridad (conectado al JS) -->
        <section id="taskFilterSection">
            <label for="taskFilter">Filtrar por prioridad:</label>
            <select id="taskFilter">
                <option value="all">Todas</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
            </select>
        </section>
