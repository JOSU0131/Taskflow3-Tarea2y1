
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

    // ── SIDEBAR ───────────────────────────────────────────────────────────────

    // Refactor 2: sidebar open/close unified into one toggleSidebar function
    function toggleSidebar(open) {
        if (!sidebar) return;
        sidebar.classList.toggle('-translate-x-full', !open);
        sidebar.classList.toggle('translate-x-0', open);
    }

    menuToggle?.addEventListener('click', () => toggleSidebar(true));
    closeMenu?.addEventListener('click',  () => toggleSidebar(false));


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
        const li = document.createElement('li');
        li.className = 'task-item flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm';

        const deleteBtn = showDeleteBtn
            ? `<button class="delete-btn inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors" data-id="${task.id}">×</button>`
            : '';

        li.innerHTML = `
            <span class="task-title font-medium text-slate-900 dark:text-slate-50">${task.title}</span>
            <span class="task-category text-xs text-slate-500 dark:text-slate-300">${task.category}</span>
            <span class="${getBadgeClass(task.priority)}">${task.priority}</span>
            ${deleteBtn}
        `;
        return li;
    }

// 3. Renderizar las tareas

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

        if (moreEl) {
        moreEl.style.display = recent.length > 3 ? 'block' : 'none';
        recent.slice(3).forEach(t => moreListEl?.appendChild(createTaskElement(t, false)));
        }
    } 

    
    // 4. Añadir Tarea

    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('newTaskTitle');
        const categoryInput = document.getElementById('newTaskCategory');
        const priorityInput = document.getElementById('newTaskPriority');

        const newTask = {
            id: Date.now().toString(),
            title: titleInput.value.trim(),
            category: categoryInput.value,
            priority: priorityInput.value
        };

        if (newTask.title !== '') {
            tasks.push(newTask);
            saveTasks();
            renderTasks();

            // Limpiar formulario
            titleInput.value = '';
            categoryInput.value = 'Trabajo';
            priorityInput.value = 'Alta';
        }
        });
    }

    // 5. Eliminar Tarea
    
            taskList?.addEventListener('click', (e) => {
            const btn = e.target.closest('.delete-btn');
            if (!btn) return;
            tasks = tasks.filter(t => t.id !== btn.dataset.id);
                
                saveTasks();
                renderTasks();
            };
        
    

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

    loadTasks();
});

// Función global para cambiar entre secciones desde el sidebar

window.showSection = function (sectionId) {
    const sections = ['taskSection', 'calendarSection', 'notesSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return; el.style.display = (id === sectionId) ? 'block' : 'none';
    });
};
