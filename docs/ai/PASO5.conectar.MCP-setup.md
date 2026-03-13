# MCP Setup — GitHub Server con Cline

## ¿Qué es Model Context Protocol (MCP)?

Model Context Protocol es un estándar abierto creado por Anthropic que permite
a modelos de IA conectarse a herramientas y fuentes de datos externas de forma
estandarizada. Es como un "USB universal" para la IA — en lugar de que cada
herramienta necesite un " conector" de integración personalizado, de esta forma todas hablan el mismo protocolo.

Sin MCP, la IA solo conoce lo que está en la conversación.
Con MCP, la IA puede leer archivos, consultar bases de datos, acceder a GitHub,
Gmail, calendarios, y más — directamente desde el chat.

---

## Herramienta utilizada

Como alternativa a Cursor (sin plan gratuito disponible), se utilizó **Cline**,
una extensión de VS Code que soporta MCP de forma nativa y es completamente gratuita.

---

## Proceso de instalación paso a paso

### Paso 1 — Instalar Cline en VS Code
- Abrir VS Code → Extensions (`Ctrl+Shift+X`)
- Buscar **"Cline"** → Install
- Cline aparece como nuevo icono en la barra lateral izquierda

### Paso 2 — Crear cuenta en Cline
- Abrir Cline → seleccionar **"Absolutely Free"**
- Seleccionar modelo **"KwaiKAT: Kat Coder Pro"** (gratuito, soporta Tools/MCP)
- Click **"Create my Account"** → autorizar con GitHub

### Paso 3 — Configurar modelo de IA
- En Settings de Cline → API Provider → **Google Gemini**
- Obtener API key gratuita en [aistudio.google.com](https://aistudio.google.com)
- Modelo seleccionado: `gemini-2.0-flash`

### Paso 4 — Instalar servidor MCP de GitHub
Abrir el archivo de configuración MCP de Cline desde el terminal de VS Code:

```bash
code "%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json"
```

Añadir la siguiente configuración:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "tu-token-aqui"
      }
    }
  }
}
```

### Paso 5 — Generar GitHub Personal Access Token
1. Ir a GitHub → Settings → Developer Settings
2. Click **"Personal access tokens"** → **"Tokens (classic)"**
3. Click **"Generate new token"**
4. Nombre: `cline-mcp`
5. Permisos seleccionados: `repo`, `read:org`, `read:user`
6. Copiar el token y pegarlo en `cline_mcp_settings.json`
7. ⚠️ Nunca compartir ni subir el token a GitHub

### Paso 6 — Reiniciar VS Code
- Cerrar y reabrir VS Code
- Cline detecta automáticamente el servidor MCP configurado

---

## Consultas realizadas con MCP

Se intentaron las siguientes consultas en Cline usando el servidor GitHub MCP:

| # | Consulta | Resultado |
|---|---|---|
| 1 | `List my GitHub repositories` | Error 429 — límite API Gemini |
| 2 | `What MCP servers do you have configured?` | Error 429 — límite API Gemini |
| 3 | `Using GitHub MCP, tell me my GitHub username` | Error 429 — límite API Gemini |
| 4 | `List recent commits in Taskflow3-Tarea2y1` | Error 429 — límite API Gemini |
| 5 | `What files changed in the last commit?` | Error 429 — límite API Gemini |

### Problema encontrado
La API gratuita de Gemini tiene un límite diario de peticiones (`limit: 0` en
tier gratuito). Al intentar múltiples consultas en la misma sesión se agotó
el cupo diario. Este es un problema real y común en proyectos que usan APIs
gratuitas de modelos de IA.

### Solución identificada
- Usar **OpenRouter** como proveedor alternativo, que balancea automáticamente
  entre múltiples modelos gratuitos
- O esperar al día siguiente para que el límite de Gemini se resetee
- En proyectos reales se usaría un plan de pago para evitar estos límites

---

## ¿Cuándo es útil MCP en proyectos reales?

**1. Code review automatizado**
La IA puede leer el código directamente desde GitHub sin necesidad de copiarlo
manualmente. Útil para revisar PRs o detectar bugs en repositorios grandes.

**2. Gestión de tareas**
Conectado a Jira, Asana o GitHub Issues, la IA puede crear, actualizar y
priorizar tickets automáticamente basándose en el contexto del proyecto.

**3. Acceso a documentación interna**
Con el servidor de filesystem, la IA puede leer documentación local del proyecto
y responder preguntas específicas sin necesidad de copiar y pegar contenido.

**4. Integración con email y calendario**
Conectado a Gmail o Google Calendar, la IA puede resumir emails relevantes,
detectar reuniones relacionadas con el proyecto o redactar respuestas.

**5. Bases de datos en tiempo real**
La IA puede consultar datos reales de una base de datos del proyecto sin
necesidad de exportar nada manualmente, útil para análisis y reportes.

**6. Automatización de flujos de trabajo**
Combinando varios servidores MCP, la IA puede ejecutar flujos completos:
leer un issue de GitHub → consultar la base de datos → crear un ticket en Jira
→ notificar por Slack, todo en una sola conversación.

---

## Conclusión

MCP representa un cambio importante en cómo las IAs interactúan con el mundo
real. En lugar de ser herramientas aisladas, se convierten en agentes capaces
de acceder y manipular información de múltiples sistemas. Las limitaciones
encontradas (límites de API gratuitas) son parte normal del desarrollo con
herramientas de IA y se resuelven fácilmente en entornos de producción.
**ver nota abajo**

---

*Documentado durante el Taller de IA — Marzo 2026*

Nota: Probar el copilot Github, recomendado por compañero, pero antes avanzaré en la tarea 2 general.