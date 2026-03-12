
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
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const categoryFilters = document.querySelectorAll('.filter-btn');
    const priorityFilter = document.getElementById('taskFilter');

    // Sidebar (menú lateral)
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const closeMenu = document.getElementById('closeMenu');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
        });
    }

    if (closeMenu && sidebar) {
        closeMenu.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
        });
    }

    let tasks = [];
    let currentFilter = 'Todas';

    // 1. Cargar tareas desde LocalStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }

    // 2. Guardar tareas en LocalStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Helper: crear el elemento DOM de una tarea (estilado con Tailwind)
    function createTaskElement(task, showDeleteBtn = true) {
        const li = document.createElement('li');
        li.className = 'task-item flex items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm';

        let badgeClass =
            'task-badge inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100';
        if (task.priority === 'Alta') {
            badgeClass =
                'task-badge inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100';
        } else if (task.priority === 'Media') {
            badgeClass =
                'task-badge inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100';
        }

        const deleteBtnClass = 'delete-btn inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors';

        let deleteBtnHTML = showDeleteBtn
            ? `<button class="${deleteBtnClass}" data-id="${task.id}">×</button>`
            : '';

        li.innerHTML = `
            <span class="task-title font-medium text-slate-900 dark:text-slate-50">${task.title}</span>
            <span class="task-category text-xs text-slate-500 dark:text-slate-300">${task.category}</span>
            <span class="${badgeClass}">${task.priority}</span>
            ${deleteBtnHTML}
        `;
        return li;
    }

    // 3. Renderizar las tareas
    function renderTasks() {
        taskList.innerHTML = '';

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedPriority = priorityFilter ? priorityFilter.value : 'all';

        const filteredTasks = tasks.filter(task => {
            const matchesCategory = currentFilter === 'Todas' || task.category === currentFilter;
            const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
            const matchesSearch = task.title.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch && matchesPriority;
        });

        const priorityMap = { 'Alta': 3, 'Media': 2, 'Baja': 1 };

        filteredTasks.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);

        filteredTasks.forEach(task => {
            taskList.appendChild(createTaskElement(task, true));
        });

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

        // Renderizar el resto si hay más de 3
        if (recentTasks.length > 3) {
            moreRecentTasksContainerEl.style.display = 'block';
            const restTasks = recentTasks.slice(3);
            restTasks.forEach(task => {
                moreRecentTasksListEl.appendChild(createTaskElement(task, false));
            });
        } else {
            if (moreRecentTasksContainerEl) moreRecentTasksContainerEl.style.display = 'none';
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
    if (taskList) {
        taskList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const taskId = e.target.getAttribute('data-id');
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
            }
        });
    }

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
        if (!el) return;
        el.style.display = (id === sectionId) ? 'block' : 'none';
    });
};
