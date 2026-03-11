

- Experimento en mi primer archivo java del proyecto taskglow2. Depurado elimando redundancias y refactorizado por CursorIA.
        // Dark Mode Toggle
    const toggleBtn = document.getElementById("darkModeToggle");

    // Load saved mode on page load
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        // También activamos la clase 'dark' para Tailwind (bonus)
        document.documentElement.classList.add('dark');
        if (toggleBtn) {
            toggleBtn.textContent = "☀️";
        }
    }

    // Toggle dark mode on click
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            document.documentElement.classList.toggle('dark', isDark);

            if (isDark) {
                toggleBtn.textContent = "☀️";
                localStorage.setItem("darkMode", "enabled");
            } else {
                toggleBtn.textContent = "🌙";
                localStorage.setItem("darkMode", "disabled");
            }
        });
    }

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

- Experimento/ ayuda con Github:
    
    What went wrong / what I did
    Why your push failed earlier

    Your local branch master already had new commits (our dark mode + sidebar changes), but the remote on GitHub also had new commits you didn’t have locally.
    When you (and I) tried git push origin master, Git rejected it with “fetch first” because that push would have overwritten remote history.
    How I fixed it (as you requested)

    Ran a rebase pull to integrate the remote commits cleanly on top of your work:

    git pull --rebase origin master
    This applied your 2 local commits after the latest commits from GitHub, with no conflicts.
    Then pushed the rebased branch:

    git push origin master
    GitHub also reported the repo has moved to https://github.com/JOSU0131/taskflow2.git, but the push still went through to the existing remote.
    Verified status:

    git status -sb
    # -> master...origin/master
    → Local master is now in sync with origin/master; everything is clean and up to date.

    Side note: your manual VS Code attempt

    Most likely, when you tried to push from VS Code, you hit the same situation: remote was ahead, so VS Code showed an error about needing to pull first. The git pull --rebase I just ran is exactly the “fix” VS Code was asking for, but done from the command line.

- Explicación paso a paso de CURSOS sobre Tailwind y la "migración"

    Step-by-step: first Tailwind migration in taskflow2
    I migrated only the main task card (add-task app + form + list) to use Tailwind, while keeping your existing classes so your JS and CSS still work.


    - Wrap the card with Tailwind layout classes
        1) Identify the block to migrate
        In index.ngl.html
        I kept add-task app for compatibility and added Tailwind classes for layout, radius, background, and padding:

        <div class="add-task app bg-white dark:bg-slate-800 rounded-2xl shadow-lg px-6 py-5">
        What this does:
        bg-white / dark:bg-slate-800: white in day, soft dark in night.
        rounded-2xl shadow-lg px-6 py-5: modern card with rounded corners and padding.
        3) Style the title with Tailwind
        <h2 class="text-lg font-semibold mb-3">Mis tareas</h2>
        Slightly larger, bold, with margin under.
        4) Convert the form layout to Tailwind (keep IDs/classes for JS)
        Original:

        <form id="taskForm" class="task-form">
            <input ... />
            <select ...></select>
            <select ...></select>
            <button ...>Agregar Tarea</button>
        </form>
        New version:

        <form id="taskForm" class="task-form flex flex-wrap gap-3 mb-4">
            <input type="text"
                id="newTaskTitle"
                placeholder="Nueva tarea"
                required
                class="flex-1 min-w-[180px] rounded-md border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-600 px-3 py-2 text-sm" />
            <select id="newTaskCategory"
                    class="min-w-[140px] rounded-md border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-600 px-3 py-2 text-sm">
                <option value="Trabajo">Trabajo</option>
                <option value="Formación">Formación</option>
                <option value="Equipo">Equipo</option>
                <option value="Personal">Personal</option>
            </select>
            <select id="newTaskPriority"
                    class="min-w-[120px] rounded-md border border-slate-300 bg-white dark:bg-slate-900 dark:border-slate-600 px-3 py-2 text-sm">
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
            </select>
            <button type="submit"
                    id="addTaskBtn"
                    class="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white text-sm font-semibold px-4 py-2 hover:bg-indigo-700 transition-colors">
                Agregar Tarea
            </button>
        </form>
        Layout:
        flex flex-wrap gap-3 mb-4 on the form for responsive row layout.
        Inputs/selects:
        rounded-md border border-slate-300 bg-white px-3 py-2 text-sm.
        Dark mode variants: dark:bg-slate-900 dark:border-slate-600 so they stay readable.
        Button:
        Indigo pill with hover state: bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2.
        IDs (newTaskTitle, newTaskCategory, newTaskPriority, taskForm) and id="addTaskBtn" are unchanged, so Script2.js continues to work.

        5) Improve the task list spacing with Tailwind
        Original:

        <ul class="task-list" id="taskList"></ul>
        Now:

        <ul class="task-list space-y-2" id="taskList"></ul>
        space-y-2 adds vertical spacing between tasks that Script2.js injects.
        6) No new document was needed
        All changes were inside index.ngl.html.


- 