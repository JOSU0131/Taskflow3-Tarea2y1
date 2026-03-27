const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config/env'); // Usamos lo que ya validamos

const connectDB = async () => {
    try {
        // Usamos la variable MONGODB_URI que viene de env.js
        const conn = await mongoose.connect(MONGODB_URI); 
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;