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


ccccc