
// DARK MODE TOGGLE

const toggleBtn = document.getElementById("darkModeToggle");

// Refactor 1: extracted to named function — easier to read and reuse
function applyDarkMode(enabled) {
    document.body.classList.toggle("dark-mode", enabled);
    document.documentElement.classList.toggle("dark", enabled);
    if (toggleBtn) toggleBtn.textContent = enabled ? "☀️" : "🌙";
    localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
}

// Load saved preference on page load
applyDarkMode(localStorage.getItem("darkMode") === "enabled");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        applyDarkMode(!document.body.classList.contains("dark-mode"));
    });
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
// JavaScript source code

document.addEventListener('DOMContentLoaded', () => {

    // ── ELEMENT REFERENCES ────────────────────────────────
    const taskForm      = document.getElementById('taskForm');
    const taskList      = document.getElementById('taskList');
    const searchInput   = document.getElementById('searchInput');
    const priorityFilter = document.getElementById('taskFilter');
    const categoryFilters = document.querySelectorAll('.filter-btn');
    const menuToggle    = document.getElementById('menuToggle');
    const sidebar       = document.getElementById('sidebar');
    const closeMenu     = document.getElementById('closeMenu');

    let tasks = [];
    let currentFilter = 'Todas';
    let isCardView    = false;
    let editingTaskId = null;

    // ── SIDEBAR ───────────────────────────────────────────────────────────────

    // Refactor 2: sidebar open/close unified into one toggleSidebar function
    function toggleSidebar(open) {
        if (!sidebar) return;
        sidebar.classList.toggle('-translate-x-full', !open);
        sidebar.classList.toggle('translate-x-0', open);
    }

menuToggle?.addEventListener('click', () => toggleSidebar(true));
closeMenu?.addEventListener('click',  () => toggleSidebar(false));

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


    // 2. Guardar tareas en LocalStorage
    // ── LOCALSTORAGE ──────────────────────────────────────────────────────────

    function loadTasks() {
        const stored = localStorage.getItem('tasks');
        if (stored) {
            tasks = JSON.parse(stored);
            renderTasks();
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }


// Helper: crear el elemento DOM de una tarea

    const BADGE_CLASSES = {
        Alta:  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
        Media: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100',
        Baja:  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
    };

    function getBadgeClass(priority) {
        return `task-badge inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${BADGE_CLASSES[priority] || BADGE_CLASSES.Baja}`;
    }

    function createTaskElement(task, showDeleteBtn = true) {
    return isCardView
        ? createTaskCard(task, showDeleteBtn)
        : createTaskListItem(task, showDeleteBtn);
}

function createTaskListItem(task, showDeleteBtn) {
    const li = document.createElement('li');
    li.className = 'task-item flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm';
    li.dataset.id = task.id;

    const editBtn = showDeleteBtn
    ? `<button class="edit-btn inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-400 text-white text-xs font-bold hover:bg-indigo-600 transition-colors" data-id="${task.id}">✎</button>`
    : '';
    const deleteBtn = showDeleteBtn
        ? `<button class="delete-btn inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors" data-id="${task.id}">×</button>`
        : '';

    li.innerHTML = `
        <span class="task-title font-medium text-slate-900 dark:text-slate-50">${task.title}</span>
        <span class="task-category text-xs text-slate-500 dark:text-slate-300">${task.category}</span>
        <span class="${getBadgeClass(task.priority)}">${task.priority}</span>
        <div class="flex gap-1">${editBtn}${deleteBtn}</div>
    `;
    return li;
}

function createTaskCard(task, showDeleteBtn) {
    const div = document.createElement('div');
    div.className = 'task-card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col gap-2';
    div.dataset.id = task.id;

    const priorityIcon = { Alta: '🔴', Media: '🟡', Baja: '🟢' }[task.priority] || '⚪';
    const categoryIcon = { Trabajo: '💼', Formación: '📚', Equipo: '👥', Personal: '👤' }[task.category] || '📌';

    const editBtn = showDeleteBtn
    ? `<button class="edit-btn mt-1 w-full text-xs bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-lg py-1 transition-colors" data-id="${task.id}">✎ Editar</button>`
    : '';
    const deleteBtn = showDeleteBtn
        ? `<button class="delete-btn mt-1 w-full text-xs bg-red-100 text-red-600 hover:bg-red-200 rounded-lg py-1 transition-colors" data-id="${task.id}">× Eliminar</button>`
        : '';

    div.innerHTML = `
        <div class="flex items-start justify-between">
            <span class="font-semibold text-slate-900 dark:text-slate-50 text-sm">${task.title}</span>
            <span class="text-lg">${priorityIcon}</span>
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400">${categoryIcon} ${task.category}</div>
        <span class="${getBadgeClass(task.priority)} self-start">${task.priority}</span>
        ${editBtn}
${deleteBtn}
    `;
    return div;
}

// 3. Renderizar las tareas

    function startEditTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editingTaskId = taskId;

    const titleInput    = document.getElementById('newTaskTitle');
    const categoryInput = document.getElementById('newTaskCategory');
    const priorityInput = document.getElementById('newTaskPriority');
    const submitBtn     = taskForm?.querySelector('button[type="submit"]');

    if (titleInput)    titleInput.value    = task.title;
    if (categoryInput) categoryInput.value = task.category;
    if (priorityInput) priorityInput.value = task.priority;
    if (submitBtn)     submitBtn.textContent = '💾 Guardar cambios';

    titleInput?.focus();
    taskForm?.scrollIntoView({ behavior: 'smooth' });
    }

    function cancelEdit() {
    editingTaskId = null;
    const submitBtn = taskForm?.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Añadir tarea';
    taskForm?.reset();
    }

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

   function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = '';
        getFilteredTasks().forEach(task => taskList.appendChild(createTaskElement(task)));
        updateNovedades();
    }

    // Actualizar sección de Novedades (últimos 3 días)

    function updateNovedades() {
        const recentTasksCountEl = document.getElementById('recentTasksCount');
        const recentTasksListEl = document.getElementById('recentTasksList');
        const moreRecentTasksContainerEl = document.getElementById('moreRecentTasksContainer');
        const moreRecentTasksListEl = document.getElementById('moreRecentTasksList');

        if (!recentTasksCountEl || !recentTasksListEl) return;

        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);

        // Asumimos que task.id es el timestamp de creación
        const recentTasks = tasks.filter(task => {
            const taskTimestamp = parseInt(task.id);
            return !isNaN(taskTimestamp) && taskTimestamp >= threeDaysAgo;
        }).sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Más recientes primero

        recentTasksCountEl.textContent = recentTasks.length;

        // Limpiar listas
        recentTasksListEl.innerHTML = '';
        if (moreRecentTasksListEl) moreRecentTasksListEl.innerHTML = '';

        // Renderizar hasta 3 tareas
        const top3 = recentTasks.slice(0, 3);
        top3.forEach(task => {
            recentTasksListEl.appendChild(createTaskElement(task, false));
        });


        // Renderizar el resto si(if) hay más de 3

        if (moreRecentTasksContainerEl) {
        moreRecentTasksContainerEl.style.display = recentTasks.length > 3 ? 'block' : 'none';
        recentTasks.slice(3).forEach(t => moreRecentTasksListEl?.appendChild(createTaskElement(t, false)));
        }
    } 

    
    // 4. Añadir Tarea

    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const titleInput = document.getElementById('newTaskTitle');
            const categoryInput = document.getElementById('newTaskCategory');
            const priorityInput = document.getElementById('newTaskPriority');
            const title         = titleInput.value.trim();
    
        if (!title) return;

        if (editingTaskId) {
            tasks = tasks.map(t => t.id === editingTaskId
                ? { ...t, title, category: categoryInput.value, priority: priorityInput.value }
                : t
            );
            cancelEdit();
        } else {
            tasks.push({
                id:       Date.now().toString(),
                title,
                category: categoryInput.value,
                priority: priorityInput.value,
            });
        }

        saveTasks();
        renderTasks();
        titleInput.value    = '';
        categoryInput.value = 'Trabajo';
        priorityInput.value = 'Alta';
        });
    }

    // 5. Eliminar Tarea
    
            taskList?.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.delete-btn');
                const editBtn   = e.target.closest('.edit-btn');

                if (deleteBtn) {
                    tasks = tasks.filter(t => t.id !== deleteBtn.dataset.id);
                    saveTasks();
                    renderTasks();
                }

                if (editBtn) {
                    startEditTask(editBtn.dataset.id);
                }
            });
        
    

    // 6. Búsqueda por texto (Tiempo real)
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderTasks();
        });
    }

    if (priorityFilter) {
        priorityFilter.addEventListener('change', () => {
            renderTasks();
        });
    }

    // 7. Filtro por categorías
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Actualizar botones activos
            categoryFilters.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            currentFilter = e.target.getAttribute('data-category');
            renderTasks();
        });
    });

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

    for (let i = 0; i < startDay; i++) {
        html += `<div class="h-9 rounded-lg"></div>`;
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const cls = isToday
            ? 'bg-indigo-600 text-white font-bold'
            : 'hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-700 dark:text-slate-200';
        html += `<div class="h-9 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors ${cls}">${day}</div>`;
    }

    html += `</div>`;
    calendarEl.innerHTML = html;

    document.getElementById('prevMonth')?.addEventListener('click', () => renderCalendar(new Date(year, month - 1, 1)));
    document.getElementById('nextMonth')?.addEventListener('click', () => renderCalendar(new Date(year, month + 1, 1)));
    }

    loadTasks();
    renderCalendar();
});

// Función global para cambiar entre secciones desde el sidebar

window.showSection = function (sectionId) {
    const sections = ['taskSection', 'calendarSection', 'notesSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return; el.style.display = (id === sectionId) ? 'block' : 'none';
    });
};
