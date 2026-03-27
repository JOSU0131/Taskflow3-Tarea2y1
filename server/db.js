const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config/env'); // Traemos la URI validada

// Aquí es donde ocurre la magia: usamos process.env para que Vercel
// lea la variable que configuramos en su panel.
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;