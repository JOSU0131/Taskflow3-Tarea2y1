# Lista de cambios y commits. En PASO 4.Refactorizar TaskFlow usando IA

Cambios realizados manualmente a "mano a mano (jeje)"

- 1. Refactorizado el dark mode en java.script
    Refactor 1 — Dark mode
    Before: the same 3 lines repeated twice (on load + on click)
    After: one function applyDarkMode(true/false) called in both places


- 2. Refactorizado "sidebar open/close unified into one toggleSidebar function" y limpieza en la referencia de elementos, y local storage
    Refactor 2 — Sidebar
    Before: two separate open/close blocks with duplicate classList lines
    After: one toggleSidebar(open) function with a boolean
    

- 3. Refactorizado "badge classes extracted to a lookup object — no more if/else chain"
    Refactor 3 — Badge colors
    Before: long if/else chain checking priority 3 times
    After: a BADGE_CLASSES object — just look up the key
    Why: adding a new priority now = one line instead of a new if block

- 4. Refactorizado Logica renderTasks hacia " filtering + sorting + rendering" todo a la vez y añadir nueva función
    Refactor 4 — Filter logic
        Before: renderTasks() was doing filtering + sorting + rendering all at once
        After: getFilteredTasks() handles filter/sort, renderTasks() just renders
        Why: each function does one job — easier to debug
    
    Manualmente añadida "function getFilteredTasks()" y reemplazada "renderTasks()"

- 5. Refactorizado función "updateNovedades"
        Refactor 5 — Guard clause
        Before: updateNovedades() wrapped everything inside if (element exists)
        After: exits immediately at the top if elements don't exist
        Why: less nesting, easier to read

- 6. Refactorizado "closest"
asdffaf 6.
        Refactor 6 — closest()
        Before: e.target.classList.contains('delete-btn')
        After: e.target.closest('.delete-btn')
        Why: if the button has a child element like an icon inside, clicking the icon would miss the original check — closest() catches both