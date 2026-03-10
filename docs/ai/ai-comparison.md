# Comparativa entre asistentes de IA
    Aquí documentaremos una comparativa en IAs


# Tarea 0
    Crea cuentas en ChatGPT y Claude si aún no las tienes

# Tarea 1
    Tarea para ambos asistent IA.
    Promt: "que expliquen al menos tres conceptos técnicos (*por ejemplo closures, event loop, DOM, hoisting o prototipos*) con explicacoones breves y sencillas"

# CHATGPT   
    
Aquí tienes explicaciones breves y sencillas de cuatro conceptos comunes en programación web (especialmente en JavaScript):

1. Closures
Un closure ocurre cuando una función recuerda las variables que estaban a su alrededor cuando fue creada, incluso si se ejecuta más tarde o en otro lugar.

- En palabras simples:
Una función puede seguir usando variables externas, aunque la función original ya haya terminado.

2. Event Loop
El event loop es el mecanismo que permite que JavaScript maneje tareas asíncronas (como temporizadores, clics o peticiones a internet).

- En palabras simples:
Es como una cola de tareas que revisa constantemente si hay algo pendiente y lo ejecuta cuando puede.

3. DOM
El Document Object Model es una representación del contenido de una página web en forma de árbol de objetos.

- En palabras simples:
Es la forma en que Web Browser entiende y organiza el HTML para que JavaScript pueda modificarlo (cambiar textos, colores, añadir elementos, etc.).

4. Hoisting
El hoisting es el comportamiento por el cual JavaScript “mueve” las declaraciones de variables o funciones al inicio del código antes de ejecutarlo.

- En palabras simples:
Puedes usar una función o variable antes de declararla, porque el motor de JavaScript la prepara primero.


# Claude

1. Closures
Una closure es cuando una función "recuerda" las variables del lugar donde fue creada, incluso después de que ese lugar ya terminó de ejecutarse.
Ejemplo simple: Imagina una mochila. Cuando creas una función dentro de otra, la función interior lleva consigo una mochila con todas las variables de la función exterior. Aunque la función exterior ya acabó, la interior sigue accediendo a esa mochila.

ejemplo
    js
    function crearContador() {
    let cuenta = 0; // esta variable queda en la "mochila"
    return function () {
        cuenta++;
        return cuenta;
    };
    }
    const contador = crearContador();
    contador(); // 1
    contador(); // 2  ← sigue recordando "cuenta"


# Tarea 2
Escribe tres funciones JavaScript con errores intencionales y pide a ambos asistentes que detecten y expliquen el bug.

# Claude
    *errores en corchetes, comas, y mayúsculas o puntuacion

- doc js

    Funcion 1.
    1. Esperar a que el DOM esté listo
    document.addEventListener("domcontentLoaded", () => {

    Funcion 2
    2. Seleccionar elementos del html
  const boton = document.getElementById("mi-boton");
  const input = document.getElementById("mi-input");
  const lista = document.getElementById("mi-lista"

    Función 3
    3. Escuchar eventos y responder
  boton.addEventListener("click", () => 
    const texto = input.value;
    
    const li = document.createElement("li");
    li.textContent = texto;
    listaappendChild(li);
    
    input.value = ""; // LIMPIAR IMPUT
  });
});

- Promt: en este doc java script dectecta los tres fallos principales y da una breve explicación:

    - Claude responde : 
    1. Fallo 1 — Typo en el nombre del evento
    // ❌ MAL
    document.addEventListener("domcontentLoaded", () => {
    // ✅ BIEN
    document.addEventListener("DOMContentLoaded", () => {
    
    JavaScript es sensible a mayúsculas. "domcontentLoaded" no existe, debe ser "DOMContentLoaded".

    2. Fallo 2 — Paréntesis de cierre faltante
    // ❌ MAL
    const lista = document.getElementById("mi-lista"
    // ✅ BIEN
    const lista = document.getElementById("mi-lista");
    Le falta el ) para cerrar el getElementById y el ; al final.

    3. Fallo 3 — Punto faltante y llaves faltantes
    js
    // ❌ MAL
    listaappendChild(li);   // falta el punto
    boton.addEventListener("click", () =>  // falta abrir llave {
    // ✅ BIEN
    lista.appendChild(li);
    boton.addEventListener("click", () => {
    Sin el . JavaScript no entiende que appendChild es un método de lista. Y sin la { el callback del evento no tiene cuerpo definido.

# CHAT GPT
Mismo doc jav con mismos errores.

- Chatgpt responde:
1. Evento del DOM mal escrito
    document.addEventListener("domcontentLoaded", () => {

    ❌ Error: domcontentLoaded está mal escrito.
    ✅ Correcto: DOMContentLoaded.

    Explicación:
    Este evento se ejecuta cuando el Document Object Model ya está cargado. Si se escribe mal, el código nunca se ejecutará.

2. Falta un paréntesis al seleccionar un elemento
    const lista = document.getElementById("mi-lista"
    ❌ Error: Falta cerrar el paréntesis ).
    ✅ Correcto:
    const lista = document.getElementById("mi-lista");

    Explicación:
    El navegador detectará un error de sintaxis y el script se detendrá.



3. Error en el listener y en appendChild
    boton.addEventListener("click", () => 
    ❌ Error: Falta abrir las llaves {} de la función.
    También hay otro error aquí:
    listaappendChild(li);
    ❌ Falta el punto .
    ✅ Correcto:
    boton.addEventListener("click", () => {
    const texto = input.value;

    const li = document.createElement("li");
    li.textContent = texto;
    lista.appendChild(li);

    input.value = "";
    });

    Explicación:
    Las funciones flecha necesitan {} cuando tienen varias instrucciones.
    appendChild es un método del elemento y debe llamarse con lista.appendChild().

    ✅ Resumen de los 3 fallos principales:
    Evento DOMContentLoaded mal escrito.
    Paréntesis faltante en getElementById.
    Errores de sintaxis en el evento click ({} faltantes y lista.appendChild mal escrito).

# Conclusiones Tarea 1 y Tarea 2
- Al pedir la tarea 1 de explicar las diferencias de tres conceptos tecnicos a Claude directamente me puso ejemplos, en cambio CHATGPT no.

- En el ejercicio 2, detección de errores. Claude vuelve a dar ejemplos con codigo, señala donde están los errores, da explicaciones mas sencillas y detalladas. En cambio CHATGPT es mas tajante, da mas rodeos y da peores explicaciones ante los mismos fallos.


# Tarea 3
Describe en lenguaje natural tres funciones distintas y pide que generen la implementación

# CHATGPT 
- Prompt: "En un doc javaScript: Crea un botón de busqueda para un doc.html, crea una lista de tareas, y crea un desplegable de categorias para esas tareas."

- Respuesta de CHATGPT:
    - Boton de Busqueda 
        HTML 
        <input type="text" id="busqueda" placeholder="Buscar...">
        <button id="boton-buscar">Buscar</button>
        <p id="resultado"></p>

        JavaScript
        document.getElementById("boton-buscar").addEventListener("click", () => {
        const texto = document.getElementById("busqueda").value;
        document.getElementById("resultado").textContent = "Buscando: " + texto;
        });

    - Lista de Tareas. Permite añadir tareas a una lista.
        HTML
        <input type="text" id="nueva-tarea" placeholder="Nueva tarea">
        <button id="agregar-tarea">Añadir</button>
        <ul id="lista-tareas"></ul>

        JavaScript
        const boton = document.getElementById("agregar-tarea");
        const input = document.getElementById("nueva-tarea");
        const lista = document.getElementById("lista-tareas");

        boton.addEventListener("click", () => {
        const tarea = input.value;

        const li = document.createElement("li");
        li.textContent = tarea;

        lista.appendChild(li);
        input.value = "";
        });

    - Desplegable de categorías para las tareas. Permite seleccionar una categoría para cada tarea.
        HTML
        <select id="categoria">
        <option value="trabajo">Trabajo</option>
        <option value="estudio">Estudio</option>
        <option value="personal">Personal</option>
        </select>

        JavaScript (añadiendo la categoría a la tarea)
        const categoria = document.getElementById("categoria");

        boton.addEventListener("click", () => {
        const tarea = input.value;
        const cat = categoria.value;

        const li = document.createElement("li");
        li.textContent = tarea + " (" + cat + ")";

        lista.appendChild(li);
        input.value = "";
        });

    - Resultado
        Botón que realiza una búsqueda.
        Lista donde se añaden tareas.
        Menú desplegable para elegir la categoría de cada tarea

    
# Claude
- Prompt: "En un doc javaScript: Crea un botón de busqueda para un doc.html, crea una lista de tareas, y crea un desplegable de categorias para esas tareas."

- Respuesta de Claude
        Archivo JavaScript:
        document.addEventListener("DOMContentLoaded", () => {

    // ── DATOS ──────────────────────────────────────────────
    const tareas = [
        { texto: "Comprar leche",       categoria: "Personal" },
        { texto: "Entregar informe",    categoria: "Trabajo"  },
        { texto: "Estudiar JavaScript", categoria: "Estudio"  },
        { texto: "Hacer ejercicio",     categoria: "Personal" },
        { texto: "Leer documentación",  categoria: "Estudio"  },
        { texto: "Reunión de equipo",   categoria: "Trabajo"  },
    ];

    // ── SELECCIONAR ELEMENTOS ───────────────────────────────
    const inputBusqueda  = document.getElementById("input-busqueda");
    const btnBuscar      = document.getElementById("btn-buscar");
    const selectCategoria = document.getElementById("select-categoria");
    const listaTareas    = document.getElementById("lista-tareas");

    // ── RENDERIZAR TAREAS ───────────────────────────────────
    function renderizar(filtradas) {
        listaTareas.innerHTML = "";

        if (filtradas.length === 0) {
        listaTareas.innerHTML = "<li>No se encontraron tareas</li>";
        return;
        }

        filtradas.forEach(tarea => {
        const li = document.createElement("li");
        li.textContent = `${tarea.texto} — [${tarea.categoria}]`;
        listaTareas.appendChild(li);
        });
    }

    // ── FILTRAR ─────────────────────────────────────────────
    function filtrar() {
        const busqueda  = inputBusqueda.value.toLowerCase();
        const categoria = selectCategoria.value;

        const resultado = tareas.filter(tarea => {
        const coincideTexto     = tarea.texto.toLowerCase().includes(busqueda);
        const coincideCategoria = categoria === "Todas" || tarea.categoria === categoria;
        return coincideTexto && coincideCategoria;
        });

        renderizar(resultado);
    }

    // ── EVENTOS ─────────────────────────────────────────────
    btnBuscar.addEventListener("click", filtrar);

    selectCategoria.addEventListener("change", filtrar);

    inputBusqueda.addEventListener("keyup", (e) => {
        if (e.key === "Enter") filtrar();
    });

    // ── INICIO ──────────────────────────────────────────────
    renderizar(tareas);

    });

Las tres piezas se conectan así:

Desplegable filtra por categoría al cambiar
Buscador filtra por texto al hacer click o pulsar Enter
Ambos filtros actúan juntos al mismo tiempo sobre la misma lista


# Conclusiones Tarea 3
- En el ejercio 3, describe en lenguaje natural tres funciones distintas y pide que generen la implementación. Chatgpt es un poco lento, pero da buenos resultados y ofrece sugerencias e ideas nuevas.
En cambio Claude va al granom, aporta un buen codigo, bien detallado pero no ofrece sugerencias ni ideas nuevas.

- "fallo" de CLaude
    Al analizar el codigo ofrecido, se ve que Claude "olvida" crear el botón. Al ser tan directa esta IA, soluciona el problema pero no "entiende" el paso previo. 
    Al pedirle "expliaciones" o que busque el fallo, si que lo soluciona, con promt: **pero no te falta un boton de busqueda? o esta es un fallo en esta linea de codigo: "const btnBuscar = document.getElementById("btn-buscar");**

        html<!-- El botón vive aquí, en el HTML -->
        <input id="input-busqueda" type="text" placeholder="Buscar tarea..." />
        <button id="btn-buscar">Buscar</button>

        <select id="select-categoria">
        <option>Todas</option>
        <option>Personal</option>
        <option>Trabajo</option>
        <option>Estudio</option>
        </select>

        <ul id="lista-tareas"></ul>

        <script src="script.js"></script>