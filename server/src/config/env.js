// Carga las variables del archivo .env en process.env
require('dotenv').config();

// Validación — si no existe PORT el servidor se niega a arrancar
if (!process.env.PORT) {
    throw new Error('El puerto no está definido en .env');
}


if (!process.env.MONGODB_URI) {
    throw new Error('La variable MONGODB_URI no está definida');
}

// Exportamos la configuración para usarla en otros archivos
module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI // <--- Añadimos esto
};
