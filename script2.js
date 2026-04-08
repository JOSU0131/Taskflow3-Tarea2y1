// IMPORTANTE Conectar frontend con API
import { fetchTasks, createTask, deleteTask } from './api.js';

// ── MODO OSCURO ───────────────────────────────────────────────────────────────

const toggleBtn = document.getElementById("darkModeToggle");

/**
 * Activa o desactiva el modo oscuro.
 * Guarda la preferencia en localStorage para recordarla al recargar.
 * @param {boolean} enabled - true = modo oscuro, false = modo claro
 */
function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
    document.documentElement.classList.toggle("dark", enabled);
    if (toggleBtn) toggleBtn.textContent = enabled ? "☀️" : "🌙";
    localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
}

// Aplicar preferencia guardada al cargar la página
applyDarkMode(localStorage.getItem("darkMode") === "enabled");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        applyDarkMode(!document.body.classList.contains("dark-mode"));
    });
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
//          DOMContent
document.addEventListener('DOMContentLoaded', () => {
    
    async function loadTasks() {
        try {
            const data = await fetchTasks(); // Viene de api.js
            tasks = data; // Guardamos lo que diga el backend en nuestra variable local
            renderTasks(); // Dibujamos la interfaz
        } catch (error) {
            console.error("Error cargando tareas:", error);
        }
    }


    // ── REFERENCIAS A ELEMENTOS DEL HTML ──────────────────────────────────────
    const taskForm        = document.getElementById('taskForm');
    const taskList        = document.getElementById('taskList');
    const searchInput     = document.getElementById('searchInput');
    const priorityFilter  = document.getElementById('taskFilter');
    const categoryFilters = document.querySelectorAll('.filter-btn');
    const menuToggle      = document.getElementById('menuToggle');
    const sidebar         = document.getElementById('sidebar');
    const closeMenu       = document.getElementById('closeMenu');
    const viewToggleBtn   = document.getElementById('viewToggleBtn');
    const taskCountLabel  = document.getElementById('taskCountLabel');
    const sidebarCount    = document.getElementById('sidebarTaskCount');

    // Variables de estado
    let tasks         = [];       // lista de tareas en memoria
    let currentFilter = 'Todas'; // categoría activa en el panel derecho
    let isCardView    = false;    // false = lista, true = tarjetas
    let editingTaskId = null;     // id de la tarea en edición (null = modo añadir)
    let dragSrcId     = null;     // id de la tarea que se está arrastrando

    // ── SIDEBAR ───────────────────────────────────────────────────────────────

    /**
     * Abre o cierra el sidebar en móvil.
     * @param {boolean} open - true = abrir, false = cerrar
     */
    function toggleSidebar(open) {
        if (!sidebar) return;
        sidebar.classList.toggle('-translate-x-full', !open);
        sidebar.classList.toggle('translate-x-0', open);
    }

    menuToggle?.addEventListener('click', () => toggleSidebar(true));
    closeMenu?.addEventListener('click',  () => toggleSidebar(false));

    // Alterna entre vista lista y vista tarjetas
    viewToggleBtn?.addEventListener('click', () => {
        isCardView = !isCardView;
        viewToggleBtn.textContent = isCardView ? '☰ Lista' : '⊞ Tarjetas';
        if (taskList) {
            taskList.className = isCardView
                ? 'grid grid-cols-2 gap-3 p-1'
                : 'task-list space-y-2';
        }
        renderTasks();
    });

    // ── LOCALSTORAGE ──────────────────────────────────────────────────────────
    


    // eliminado pasamos a backend

    // ── BADGES Y PRIORIDADES ──────────────────────────────────────────────────

    // Clases de color para cada nivel de prioridad
    const BADGE_CLASSES = {
        Alta:  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
        Media: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100',
        Baja:  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
    };

    // Ciclo de prioridades al hacer clic en el circulito: Alta → Media → Baja → Alta
    const PRIORITY_CYCLE = { Alta: 'Media', Media: 'Baja', Baja: 'Alta' };

    /**
     * Devuelve las clases Tailwind del badge según la prioridad.
     * @param {string} priority - 'Alta', 'Media' o 'Baja'
     * @returns {string}
     */
    function getBadgeClass(priority) {
        return `task-badge inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${BADGE_CLASSES[priority] || BADGE_CLASSES.Baja}`;
    }

    // ── CREAR ELEMENTOS DE TAREA ──────────────────────────────────────────────

    /**
     * Devuelve un elemento lista o tarjeta según la vista activa.
     * @param {object} task
     * @param {boolean} showDeleteBtn - muestra botones de acción
     */
    function createTaskElement(task, showDeleteBtn = true) {
        return isCardView
            ? createTaskCard(task, showDeleteBtn)
            : createTaskListItem(task, showDeleteBtn);
    }

    /**
     * Crea una fila de lista para una tarea.
     * Incluye circulito de prioridad clickable y soporte drag & drop.
     */
    function createTaskListItem(task, showDeleteBtn) {
        const li = document.createElement('li');
        li.className = 'task-item tarea-entra flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm';
        li.dataset.id = task.id;
        li.draggable  = true; // necesario para drag & drop

        const editBtn = showDeleteBtn
            ? `<button class="edit-btn inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-400 text-white text-xs font-bold hover:bg-indigo-600 transition-colors" data-id="${task.id}">✎</button>`
            : '';
        const deleteBtn = showDeleteBtn
            ? `<button class="delete-btn inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors" data-id="${task.id}">×</button>`
            : '';

        li.innerHTML = `
            <button class="priority-dot dot-${task.priority} w-3 h-3 rounded-full shrink-0
                           cursor-pointer hover:scale-125 transition-transform"
                    data-id="${task.id}" title="Cambiar prioridad (${task.priority})"></button>
            <span class="task-title font-medium text-slate-900 dark:text-slate-50 flex-1 truncate">${task.title}</span>
            <span class="task-category text-xs text-slate-500 dark:text-slate-300 hidden sm:inline">${task.category}</span>
            <span class="${getBadgeClass(task.priority)} shrink-0">${task.priority}</span>
            <div class="flex gap-1 shrink-0">${editBtn}${deleteBtn}</div>
        `;
        return li;
    }

    /**
     * Crea una tarjeta visual para una tarea.
     * Incluye circulito de prioridad clickable en la esquina superior.
     */
    function createTaskCard(task, showDeleteBtn) {
        const div = document.createElement('div');
        div.className = 'task-card tarea-entra bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col gap-2';
        div.dataset.id = task.id;

        const categoryIcon = { Trabajo: '💼', Formación: '📚', Equipo: '👥', Personal: '👤' }[task.category] || '📌';

        const editBtn = showDeleteBtn
            ? `<button class="edit-btn mt-1 w-full text-xs bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-lg py-1 transition-colors" data-id="${task.id}">✎ Editar</button>`
            : '';
        const deleteBtn = showDeleteBtn
            ? `<button class="delete-btn mt-1 w-full text-xs bg-red-100 text-red-600 hover:bg-red-200 rounded-lg py-1 transition-colors" data-id="${task.id}">× Eliminar</button>`
            : '';

        div.innerHTML = `
            <div class="flex items-start justify-between gap-2">
                <span class="font-semibold text-slate-900 dark:text-slate-50 text-sm">${task.title}</span>
                <button class="priority-dot dot-${task.priority} w-4 h-4 rounded-full shrink-0
                               cursor-pointer hover:scale-125 transition-transform mt-0.5"
                        data-id="${task.id}" title="Cambiar prioridad (${task.priority})"></button>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400">${categoryIcon} ${task.category}</div>
            <span class="${getBadgeClass(task.priority)} self-start">${task.priority}</span>
            ${editBtn}
            ${deleteBtn}
        `;
        return div;
    }

    // ── DRAG & DROP ───────────────────────────────────────────────────────────

    /**
     * Activa el arrastre en todos los elementos de la lista.
     * Permite reordenar las tareas arrastrándolas.
     * Solo funciona en vista lista (no tarjetas).
     */
    function setupDragAndDrop() {
        const items = taskList.querySelectorAll('[draggable="true"]');

        items.forEach(item => {
            // Al empezar a arrastrar — guardar el id origen y bajar opacidad
            item.addEventListener('dragstart', () => {
                dragSrcId = item.dataset.id;
                setTimeout(() => { item.style.opacity = '0.4'; }, 0);
            });

            // Al soltar — restaurar opacidad y quitar bordes
            item.addEventListener('dragend', () => {
                item.style.opacity = '1';
                document.querySelectorAll('.drag-sobre').forEach(el => el.classList.remove('drag-sobre'));
            });

            // Al pasar por encima — mostrar borde punteado
            item.addEventListener('dragover', e => {
                e.preventDefault();
                document.querySelectorAll('.drag-sobre').forEach(el => el.classList.remove('drag-sobre'));
                item.classList.add('drag-sobre');
            });

            // Al soltar encima de otro elemento — reordenar en el array
            item.addEventListener('drop', e => {
                e.preventDefault();
                if (dragSrcId && dragSrcId !== item.dataset.id) {
                    const srcIdx  = tasks.findIndex(t => t.id === dragSrcId);
                    const destIdx = tasks.findIndex(t => t.id === item.dataset.id);
                    if (srcIdx !== -1 && destIdx !== -1) {
                        const [moved] = tasks.splice(srcIdx, 1);
                        tasks.splice(destIdx, 0, moved);
            
                        renderTasks();
                    }
                }
            });
        });
    }

    // ── EDITAR TAREA ──────────────────────────────────────────────────────────

    /**
     * Rellena el formulario con los datos de la tarea para editarla.
     * @param {string} taskId - id de la tarea a editar
     */
    function startEditTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        editingTaskId = taskId;

        const titleInput    = document.getElementById('newTaskTitle');
        const categoryInput = document.getElementById('taskCategory');
        const priorityInput = document.getElementById('taskPriority');
        const submitBtn     = taskForm?.querySelector('button[type="submit"]');

        if (titleInput)    titleInput.value    = task.title;
        if (categoryInput) categoryInput.value = task.category;
        if (priorityInput) priorityInput.value = task.priority;
        if (submitBtn)     submitBtn.textContent = '💾 Guardar cambios';

        titleInput?.focus();
        taskForm?.scrollIntoView({ behavior: 'smooth' });
    }

    // Resetea el formulario de vuelta al modo "añadir"
    function cancelEdit() {
        editingTaskId = null;
        const submitBtn = taskForm?.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = '+ Añadir';
        taskForm?.reset();
    }

    // ── FILTRAR Y RENDERIZAR ──────────────────────────────────────────────────

    /**
     * Devuelve las tareas filtradas por búsqueda, categoría y prioridad, ordenadas.
     * @returns {Array}
     */
    function getFilteredTasks() {
        const searchTerm       = searchInput?.value.toLowerCase() ?? '';
        const selectedPriority = priorityFilter?.value ?? 'all';

        return tasks
            .filter(task => {
                const matchesCategory = currentFilter === 'Todas' || task.category === currentFilter;
                const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
                const matchesSearch   = task.title.toLowerCase().includes(searchTerm);
                return matchesCategory && matchesPriority && matchesSearch;
            })
            .sort((a, b) => ({ Alta: 3, Media: 2, Baja: 1 }[b.priority] - { Alta: 3, Media: 2, Baja: 1 }[a.priority]));
    }

    /**
     * Limpia y vuelve a pintar la lista de tareas con los filtros activos.
     * También actualiza los contadores del sidebar y la barra superior.
     */
    function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = '';
        const filtered = getFilteredTasks();
        filtered.forEach(task => taskList.appendChild(createTaskElement(task)));

        // Actualizar contadores
        const total = filtered.length;
        if (taskCountLabel) taskCountLabel.textContent = `${total} tarea${total !== 1 ? 's' : ''}`;
        if (sidebarCount)   sidebarCount.textContent   = `${tasks.length} tarea${tasks.length !== 1 ? 's' : ''} activa${tasks.length !== 1 ? 's' : ''}`;

        // Activar drag & drop solo en vista lista
        if (!isCardView) setupDragAndDrop();

        updateNovedades();
    }

    // ── NOVEDADES ─────────────────────────────────────────────────────────────

    // Actualiza el panel de novedades con tareas de los últimos 3 días
    // (solo actúa si los elementos existen en el HTML)
    function updateNovedades() {
        const recentTasksCountEl         = document.getElementById('recentTasksCount');
        const recentTasksListEl          = document.getElementById('recentTasksList');
        const moreRecentTasksContainerEl = document.getElementById('moreRecentTasksContainer');
        const moreRecentTasksListEl      = document.getElementById('moreRecentTasksList');

        if (!recentTasksCountEl || !recentTasksListEl) return;

        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);

        const recentTasks = tasks.filter(task => {
            const taskTimestamp = parseInt(task.id);
            return !isNaN(taskTimestamp) && taskTimestamp >= threeDaysAgo;
        }).sort((a, b) => parseInt(b.id) - parseInt(a.id));

        recentTasksCountEl.textContent = recentTasks.length;

        recentTasksListEl.innerHTML = '';
        if (moreRecentTasksListEl) moreRecentTasksListEl.innerHTML = '';

        recentTasks.slice(0, 3).forEach(task => {
            recentTasksListEl.appendChild(createTaskElement(task, false));
        });

        if (moreRecentTasksContainerEl) {
            moreRecentTasksContainerEl.style.display = recentTasks.length > 3 ? 'block' : 'none';
            recentTasks.slice(3).forEach(t => moreRecentTasksListEl?.appendChild(createTaskElement(t, false)));
        }
    }

    // ── AÑADIR / GUARDAR TAREA ────────────────────────────────────────────────

    // - Nueva lógica de guardado sincronizado
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titleInput = document.getElementById('newTaskTitle');
            const categoryInput = document.getElementById('taskCategory');
            const priorityInput = document.getElementById('taskPriority');
            const submitBtn = taskForm.querySelector('button[type="submit"]');
            const title = titleInput.value.trim();

            if (!title) return;

            // FASE D: ESTADO DE CARGA (El botón cambia mientras esperamos)
            submitBtn.disabled = true;
            submitBtn.textContent = 'Guardando...';

            try {
                // 1. Enviamos al servidor y ESPERAMOS la tarea con su ID oficial
                const tareaOficial = await createTask({
                    title: title,
                    priority: priorityInput.value, 
                    category: categoryInput.value
                });

                // 2. Solo si el servidor responde OK, la añadimos a nuestra lista
                tasks.push(tareaOficial); 
                
                // 3. LIMPIAMOS Y DIBUJAMOS AL INSTANTE
                titleInput.value = '';
                renderTasks(); // Esto hace que aparezca sin tocar otros botones

            } catch (error) {
                // FASE D: ESTADO DE ERROR (Lo que viste en tu imagen)
                alert("¡Vaya! El servidor no pudo guardar la tarea. Inténtalo de nuevo.");
                console.error(error);
            } finally {
                // Restauramos el botón
                submitBtn.disabled = false;
                submitBtn.textContent = '+ Añadir';
            }
        });
    }



    // ── ELIMINAR / EDITAR / CAMBIAR PRIORIDAD (click en la lista) ─────────────

    taskList?.addEventListener('click', (e) => {
        const deleteBtn   = e.target.closest('.delete-btn');
        const editBtn     = e.target.closest('.edit-btn');
        const priorityBtn = e.target.closest('.priority-dot'); // circulito de prioridad

        if (deleteBtn) {
            const taskId = deleteBtn.dataset.id;
            const item = taskList.querySelector(`[data-id="${taskId}"]`);
            
            // 1. Animamos la salida visual
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

        if (editBtn) {
            startEditTask(editBtn.dataset.id);
        }

        // Circulito — cambia la prioridad al siguiente nivel del ciclo
        if (priorityBtn) {
            const taskId = priorityBtn.dataset.id;
            tasks = tasks.map(t => t.id === taskId
                ? { ...t, priority: PRIORITY_CYCLE[t.priority] || 'Media' }
                : t
            );
            
        
            renderTasks();
        }
    });

    // ── BÚSQUEDA Y FILTROS ────────────────────────────────────────────────────

    // Búsqueda en tiempo real al escribir, y también al pulsar Enter
    if (searchInput) {
        searchInput.addEventListener('input', () => renderTasks());
    }
    searchInput?.addEventListener('keydown', e => {
        if (e.key === 'Enter') renderTasks();
    });

    // Filtro por prioridad desde el desplegable superior
    if (priorityFilter) {
        priorityFilter.addEventListener('change', () => renderTasks());
    }

    // Búsqueda en el calendario: localiza la tarea y salta al día de creación
    document.getElementById('calendarSearch')?.addEventListener('input', e => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) return;
        const match = tasks.find(t => t.title.toLowerCase().includes(term));
        if (match) {
            const d = new Date(parseInt(match.id));
            renderCalendar(d);
            setTimeout(() => {
                document.querySelector(`[data-day="${d.getDate()}"]`)?.click();
            }, 50);
        }
    });

    // Filtro por categoría desde el panel derecho
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryFilters.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-category');
            renderTasks();
        });
    });

    // ── NOTAS ─────────────────────────────────────────────────────────────────

    /**
     * Configura el área de notas con autoguardado (800ms) y guardado manual.
     * Las notas persisten en localStorage entre sesiones.
     */
    function setupNotes() {
        const notesEl  = document.getElementById('notes');
        const saveBtn  = document.getElementById('saveNotesBtn');
        const statusEl = document.getElementById('notesStatus');

        if (!notesEl) return;

        // Cargar notas guardadas. Eliminadas pasamos a backend

        // Guardado manual con el botón
        
    }

    // ── CALENDARIO ────────────────────────────────────────────────────────────

    /**
     * Dibuja el calendario mensual navegable.
     * Marca con un punto los días que tienen tareas creadas.
     * Al hacer clic en un día muestra sus tareas debajo.
     * @param {Date} date - mes a mostrar (por defecto el mes actual)
     */
    function renderCalendar(date = new Date()) {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        const year  = date.getFullYear();
        const month = date.getMonth();

        const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                            'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const dayNames   = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

        const firstDay = new Date(year, month, 1);
        const lastDay  = new Date(year, month + 1, 0);
        const startDay = (firstDay.getDay() + 6) % 7;
        const today    = new Date();

        let html = `
            <div class="flex items-center justify-between mb-4">
                <button id="prevMonth" class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-sm font-medium transition-colors">← Anterior</button>
                <h3 class="font-bold text-slate-800 dark:text-slate-100">${monthNames[month]} ${year}</h3>
                <button id="nextMonth" class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-sm font-medium transition-colors">Siguiente →</button>
            </div>
            <div class="grid grid-cols-7 gap-1 mb-2">
                ${dayNames.map(d => `<div class="text-center text-xs font-semibold text-slate-500 py-1">${d}</div>`).join('')}
            </div>
            <div class="grid grid-cols-7 gap-1">
        `;

        // Celdas vacías antes del primer día del mes
        for (let i = 0; i < startDay; i++) {
            html += `<div class="h-9 rounded-lg"></div>`;
        }

        // Días del mes que tienen al menos una tarea creada
        const taskDays = new Set(tasks.map(t => {
            const d = new Date(parseInt(t.id));
            return (d.getMonth() === month && d.getFullYear() === year) ? d.getDate() : null;
        }).filter(Boolean));

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const isToday  = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasTasks = taskDays.has(day);
            const cls = isToday
                ? 'bg-indigo-600 text-white font-bold'
                : 'hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-700 dark:text-slate-200';
            const dot = hasTasks
                ? `<span class="block w-1 h-1 rounded-full bg-indigo-400 mx-auto mt-0.5"></span>`
                : '';
            html += `<div class="h-9 flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-colors ${cls}" data-day="${day}">${day}${dot}</div>`;
        }

        html += `</div>`;
        calendarEl.innerHTML = html;

        // Navegar al mes anterior o siguiente
        document.getElementById('prevMonth')?.addEventListener('click', () => renderCalendar(new Date(year, month - 1, 1)));
        document.getElementById('nextMonth')?.addEventListener('click', () => renderCalendar(new Date(year, month + 1, 1)));

        // Click en un día — muestra las tareas creadas ese día
        calendarEl.querySelectorAll('[data-day]').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const day      = parseInt(dayEl.dataset.day);
                const dayTasks = tasks.filter(t => {
                    const d = new Date(parseInt(t.id));
                    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
                });

                const titleEl = document.getElementById('calendarDayTitle');
                const listEl  = document.getElementById('calendarDayList');
                const panel   = document.getElementById('calendarDayTasks');
                if (!listEl || !panel) return;

                if (titleEl) titleEl.textContent = `Tareas del ${day} de ${monthNames[month]}`;
                listEl.innerHTML = dayTasks.length === 0
                    ? '<li class="text-slate-400 text-xs italic">Sin tareas este día</li>'
                    : dayTasks.map(t => `
                        <li class="flex items-center gap-2 text-xs py-1">
                            <span class="w-2 h-2 rounded-full ${{Alta:'bg-red-500',Media:'bg-amber-400',Baja:'bg-green-500'}[t.priority]}"></span>
                            <span>${t.title}</span>
                            <span class="text-slate-400">${t.category}</span>
                        </li>`).join('');

                panel.classList.remove('hidden');
            });
        });
    }

    // ── INICIO ────────────────────────────────────────────────────────────────
    loadTasks();
    setupNotes();
    renderCalendar();
});

// ── CAMBIAR SECCIÓN desde los links del sidebar ───────────────────────────────

window.showSection = function (sectionId) {
    const sections = ['taskSection', 'calendarSection', 'notesSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = (id === sectionId) ? 'block' : 'none';
    });
};
