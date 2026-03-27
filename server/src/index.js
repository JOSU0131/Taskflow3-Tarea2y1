// ── CONFIGURACIÓN ─────────────────────────────────────────────────────────────
// Cargamos el puerto desde .env — si no existe lanza un error y para el servidor
// 1. IMPORTACIONES ───────────────────────────────────────────────────────────────

const { PORT } = require('./config/env');
const express = require('express');
const cors    = require('cors');
const taskRoutes = require('./routes/task.routes');

// 2. INICIALIZACIÓN
const app = express();

// 3. MIDDLEWARES GLOBALES de parseo  ─────────────────────────────────────────────

app.use(cors()); // <--- Permite que tu web hable con el server
app.use(express.json()); // <--- Permite leer los JSON que envías

// Middleware de auditoría — registra cada petición en consola
app.use((req, res, next) => {
    const inicio = Date.now();
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duracion}ms)`);
    });
    next(); // sin esto la petición se queda colgada para siempre
});


// Ruta de prueba — comprueba que el servidor está vivo
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor Taskflow funcionando 🚀' });
});

// 4. RUTAS
// Rutas de tareas — montadas bajo /api/v1/tasks
app.use('/api/v1/tasks', taskRoutes);

// 5. MANEJO DE ERRORES (Fase C) ──────────────────────────────────────────────────
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

module.exports = app;

// 6. ARRANQUE SERVIDOR ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});