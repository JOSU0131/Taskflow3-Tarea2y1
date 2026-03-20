// Cargamos la configuración primero — valida que .env existe
const { PORT } = require('./config/env');

const express = require('express');
const cors    = require('cors');

const app = express();

// ── MIDDLEWARES GLOBALES ──────────────────────────────────────────────────────

// Permite recibir JSON en el body de las peticiones
app.use(express.json());

// Permite peticiones desde el frontend (otro origen)
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

// ── RUTA DE PRUEBA ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor Taskflow funcionando 🚀' });
});

// ── ARRANCAR SERVIDOR ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});