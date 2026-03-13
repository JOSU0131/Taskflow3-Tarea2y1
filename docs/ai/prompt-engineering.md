# TAREA 2 PASO 5. Conectar servidores MCP

## ¿Qué es Model Context Protol?
    Es un protocolo de la empresa Anthropic que permite a una IA conectarse a herramientas externas como GitHub, Gmail, etc. En Cursor, esto significa que la IA puede leer tu repositorio, ver commits, issues, y más directamente desde el chat.

    nota: Como no tengo Cursor gratuito realizaré el paso 5 en Claude, en VS Code junto con Cline + OpenRouter, ya que GitHub Copilot alcanzo limite de uso gratuito.
    
    - Una vez Instalada la extensión Cline en VS code y registrado en Openrouter.ai
            Paso 1. Abrir Settings dentro de extensión Cline, pero antes ver paso 2
            Paso 2. Antes se necesita un "GitHub Token"
            Paso 3. Configuración MCP de Cline
            Paso 4. Añadir el servidor MCP en Cline
                    Crear archivo JSON para cline_mcp_settings.json
            Paso 5. Error con Claude, paso a Gemini... Gemini en Cline también me da problemas. Paso a usar Claude online con MCD ya configurado.

            Prompt: "¿Puedes ver mis repositorios de GitHub?" 

            Claude dice: Lo siento, no puedo ver tus repositorios de GitHub directamente desde aquí — aunque Claude tiene MCP conectado en esta conversación, solo tengo conectados Google Calendar y Gmail, no GitHub.
            Posibles 3 soluciones. 
            Nota: Paso a tarea 6. Prompts utiles.


## Paso 6. Prompt engineering aplicado al desarrollo

    ¿Qué es el Prompt Engineering?
    Es la práctica de diseñar instrucciones precisas para obtener mejores respuestas
    de una IA. Un buen prompt define contexto, rol, restricciones y formato esperado.
    La diferencia entre un prompt básico y uno bien diseñado puede ser enorme en
    calidad, precisión y utilidad del resultado.

    Los 10 Prompts más útiles para desarrolladores

    1. Rol de desarrollador senior — Code Review
    
    Prompt:
        "Actúa como un desarrollador senior con 10 años de experiencia en JavaScript.
        Revisa este código e identifica: bugs, malas prácticas, problemas de rendimiento
        y mejoras de legibilidad. Sé directo y explica cada problema brevemente.

        [pegar código aquí. La IA lo revisará, entre los dos corchetes]"

    ¿Por qué funciona?
    Definir un rol concreto ("senior con 10 años") activa un registro más técnico
    y crítico en la IA. Sin el rol, la respuesta tiende a ser más genérica y suave.


    2. Few-shot prompting — Generar tests unitarios
    
    Prompt:
        "Genera tests unitarios siguiendo este patrón:

        Función: sumar(a, b) → devuelve a + b
        Test: expect(sumar(2, 3)).toBe(5)
        Test: expect(sumar(-1, 1)).toBe(0)
        Test: expect(sumar(0, 0)).toBe(0)

        Ahora genera tests para esta función:
        [pegar función aquí]"

    ¿Por qué funciona?
    Los ejemplos previos (few-shot) muestran exactamente el formato esperado.
    La IA aprende el patrón de los ejemplos y lo replica con la función nueva,
    produciendo tests consistentes y bien formateados.


    3. Razonamiento paso a paso — Debugging
    
    Prompt:
        "Tengo este bug en mi código. Razona paso a paso:
        1. ¿Qué debería hacer el código?
        2. ¿Qué está haciendo realmente?
        3. ¿En qué línea exacta está el problema?
        4. ¿Cuál es la solución?

        [pegar código con el bug aquí]"

    ¿Por qué funciona?
    Pedir razonamiento paso a paso obliga a la IA a analizar el problema
    secuencialmente en lugar de saltar directamente a una solución que podría
    ser incorrecta. Reduce significativamente las alucinaciones.


    4. Restricciones claras — Refactorizar sin cambiar comportamiento
    Prompt:
        "Refactoriza esta función siguiendo estas restricciones:
        - NO cambies el comportamiento ni los resultados
        - USA nombres de variables descriptivos en inglés
        - APLICA el principio de una sola responsabilidad
        - MÁXIMO 20 líneas por función
        - NO añadas dependencias externas

        [pegar función aquí]"

    ¿Por qué funciona?
    Las restricciones explícitas eliminan la ambigüedad. Sin ellas, la IA puede
    reescribir el código de formas que rompen el comportamiento original o añaden
    complejidad innecesaria.

    5. Generar JSDoc — Documentación automática NOTA.IMPORTANTE

    Prompt:
        "Actúa como un desarrollador senior que escribe documentación clara.
        Añade comentarios JSDoc a estas funciones. Incluye:
        - Descripción breve de qué hace
        - @param con tipo y descripción de cada parámetro
        - @returns con tipo y descripción del valor devuelto
        - @example con un ejemplo de uso real

        [pegar funciones aquí]"

    ¿Por qué funciona?
    Especificar exactamente qué incluir en la documentación (@param, @returns,
    @example) garantiza que el resultado sea completo y estándar, no solo
    comentarios vagos.


    6. Combinar Rol + Restricciones — y  Optimizar rendimiento

    Prompt:
        "Actúa como un experto en rendimiento de JavaScript.
        Analiza este código y optimízalo. Restricciones:
        - Explica cada optimización con una línea de comentario
        - Mantén la legibilidad — no sacrifiques claridad por velocidad
        - Indica la mejora estimada de cada cambio (ej: "reduce iteraciones de O(n²) a O(n)")

        [pegar código aquí]"

    ¿Por qué funciona?
    Combinar rol + restricciones + formato esperado produce respuestas muy
    específicas y accionables. Pedir la mejora estimada fuerza a la IA a
    justificar cada cambio.


    7. Few-shot — Generar código consistente con el estilo del proyecto
    Nuestro proyecto usa este patrón para funciones de filtrado:

    Prompt:
        "// Patrón existente:
        function getFilteredTasks() {
            return tasks
                .filter(task => task.active)
                .sort((a, b) => a.priority - b.priority);
        }

        Siguiendo exactamente este estilo y patrón, genera una función
        que filtre tareas por categoría y las ordene por fecha de creación."

    ¿Por qué funciona?
    Mostrar el patrón existente del proyecto garantiza que el código generado
    sea consistente con el resto del codebase, reduciendo el tiempo de revisión.


    8. Pedir un Razonamiento + Restricciones — Diseño de arquitectura
    Prompt:
        "Actúa como un arquitecto de software. Tengo que añadir un sistema de
        notificaciones a mi app. Antes de escribir código:

        1. Lista 3 enfoques posibles con sus pros y contras
        2. Recomienda el más adecuado para un proyecto pequeño
        3. Muestra solo la estructura de archivos necesaria
        4. Escribe el código mínimo viable

        Restricción: sin librerías externas, solo JavaScript vanilla."
    ¿Por qué funciona?
    Pedir opciones antes del código evita que la IA salte a una solución sin
    considerar alternativas. El proceso de comparación produce decisiones más
    fundamentadas.

    9. Combinar Rol — y  Escribir mensajes de commit claros
    Prompt:
        "Actúa como un desarrollador senior que sigue las convenciones de
        Conventional Commits. Dado este diff de cambios, escribe el mensaje
        de commit apropiado en formato:

        tipo(scope): descripción breve en imperativo

        Tipos disponibles: feat, fix, refactor, docs, style, test, chore

        [pegar git diff o descripción de cambios aquí]"

    ¿Por qué funciona?
    Especificar el estándar (Conventional Commits) y dar los tipos disponibles
    produce mensajes consistentes y profesionales, útiles para changelogs
    automáticos.


    10. Restricciones — Explicar código para documentación
    Prompt:
        "Explica este código como si lo escribieras para un archivo README.
        Restricciones:
        - Máximo 3 párrafos
        - Sin jerga técnica innecesaria
        - Incluye un ejemplo de uso real
        - Menciona casos extremos o limitaciones conocidas

        [pegar código aquí]"

    ¿Por qué funciona?
    Limitar la longitud y el nivel técnico fuerza a la IA a priorizar la
    información más importante. El resultado es documentación legible para
    cualquier miembro del equipo, no solo para el autor del código.

### Resumen de técnicas usadas

    Técnica         Cuándo usarla
    Rol             lenguaje específico o resultado más técnico y experiencia
    Few-shot        Cuando el formato del output es crítico
    Paso a paso     Para debugging o análisis complejos
    Restricciones   Quieres control total sobre el resultado
    Combinadas      Para tareas complejas que requieren precisión máxima

    Documentado durante el Taller de IA — Marzo 2026


ccccc