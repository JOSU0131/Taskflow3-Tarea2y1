# Comparativa entre asistentes de IA

# Tarea 0
    Crea cuentas en ChatGPT y Claude si aún no las tienes

# Tarea 1
    Tarea para ambos asistent IA es que expliquen al menos tres conceptos técnicos (*por ejemplo closures, event loop, DOM, hoisting o prototipos*)

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

