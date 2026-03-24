// ── CONFIGURACIÓN ─────────────────────────────────────────────────────────────
// Cargamos el puerto desde .env — si no existe lanza un error y para el servidor
const { PORT } = require('./config/env');

const express = require('express');
const cors    = require('cors');

// Importamos las rutas de tareas
const taskRoutes = require('./routes/task.routes');

const app = express();

// ── MIDDLEWARES GLOBALES de parseo  ─────────────────────────────────────────────

// Permite recibir JSON en el body de las peticiones
app.use(express.json());

// Permite peticiones desde el frontend (otro origen/dominio)
app.use(cors());

// Middleware de auditoría — registra cada petición en consola
app.use((req, res, next) => {
    const inicio = Date.now();
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duracion}ms)`);
    });
    next(); // sin esto la petición se queda colgada para siempre
});

// ── RUTAS ─────────────────────────────────────────────────────────────────────
// Ruta de prueba — comprueba que el servidor está vivo
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor Taskflow funcionando 🚀' });
});

// Rutas de tareas — montadas bajo /api/v1/tasks
app.use('/api/v1/tasks', taskRoutes);

// ── MANEJO GLOBAL DE ERRORES ──────────────────────────────────────────────────
// Este middleware de 4 parámetros captura todos los errores del servidor
// Debe estar SIEMPRE al final, después de todas las rutas
app.use((err, req, res, next) => {
    // Si el servicio lanzó NOT_FOUND devolvemos 404
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Recurso no encontrado' });
    }

    // Para cualquier otro error registramos en consola y devolvemos 500
    // Nunca enviamos detalles técnicos al cliente por seguridad
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// ── ARRANCAR SERVIDOR ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});