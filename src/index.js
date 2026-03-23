// Cargamos la configuración primero — valida que .env existe
const { 3000 } =  require('./config/env');

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
app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
});


// "Middleware", maneja el registro global de errores y 
// Funciona en tiempo de ejecución (runtime)
// Captura errores reales
// Evita que el servidor caiga
// Devuelve respuestas HTTP correctas

app.use((err, req, res, next) => {
  if (err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }
// el error sube hasta este middleware

  console.error(err);

  res.status(500).json({
    error: "Error interno del servidor"
  });
});