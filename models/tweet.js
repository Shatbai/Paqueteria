const mongoose = require('mongoose');

// Crear un esquema de los datos a guardar
const tweetSchema = new mongoose.Schema({
    userId: String,
    lat: String,
    price: String,
    lon: String,
    posted: {type: Date, default: Date.now()},
})

// Exportar un modelo utilizable del esquema
module.exports = mongoose.model('Tweet', tweetSchema, 'paqueteria');