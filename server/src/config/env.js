// Carga las variables del archivo .env en process.env
require('dotenv').config();

// Validación — si no existe PORT el servidor se niega a arrancar
if (!process.env.PORT) {
    throw new Error('El puerto no está definido en .env');
}

// Exportamos la configuración para usarla en otros archivos
module.exports = {
    PORT: process.env.PORT
};
