require('dotenv').config();   // Carga las variables del archivo .env en process.env

// Validación — si no existe PORT el servidor se niega a arrancar
if (!process.env.PORT) {
    // En Vercel PORT se asigna solo, así que no lanzaremos error si falta
    console.log('Puerto no definido, usando 3000 por defecto');
}

module.exports = {
    // Si process.env.PORT no existe (como en Vercel), usa el 3000 por defecto
    PORT: process.env.PORT || 3000,
    
};


