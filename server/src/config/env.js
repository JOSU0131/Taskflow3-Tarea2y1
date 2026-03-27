// Carga las variables del archivo .env en process.env
require('dotenv').config();

// Validación — si no existe PORT el servidor se niega a arrancar
if (!process.env.PORT) {
    throw new Error('El puerto no está definido en .env');
}

module.exports = {
    // Si process.env.PORT no existe (como en Vercel), usa el 3000 por defecto
    PORT: process.env.PORT || 3000,
    // Traemos la URI de MongoDB
    MONGODB_URI: process.env.MONGODB_URI
};


if (!process.env.MONGODB_URI) {
    throw new Error('La variable MONGODB_URI no está definida');
}

// Exportamos la configuración para usarla en otros archivos
module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI // <--- Añadimos esto
};
