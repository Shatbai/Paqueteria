/*--- Servidor Express para recibir y despachar solicitudes HTTP ---*/
// Temática del taller: Aplicación para 
// crear/desplegar Tweets. Cada tweet tendrá texto, arreglo de menciones y  arreglo de “hashtags”

// Setup inicial
require('dotenv').config();         // para poder acceder a la información en .env
const express = require('express');
const server = express();              // inicializar un servidor de express para recibir requests
const indexRouter = require('./routes/index');
const path = require('path');

const port = process.env.PORT || 3010;   // puerto donde se corre el servidor. Todo servicio en tu compu requiere un servidor

// Dependencias
const cors = require('cors');

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');

// Connexión a base de datos
const mongoose = require("mongoose");
const URI = process.env.CONNECTIONSTRING;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // esto es "boilerplate code", siempre es igual

const db = mongoose.connection;
db.on('error', err => console.error(err));      // si hay evento de error notificalo
db.once('open', ()=> console.log("Conexión con Mongo exitosa"));  // una vez abierta la conexión notificalo

// Middleware para el manejo de requests
server.use(cors())
server.use(express.json());        // el formato de los datos usados es JSON

// Modelos de la Base de Datos
const Tweet = require('./models/tweet.js');

const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));

/* ---RUTAS--- */
// GET: dame información
// POST: te mando información

server.use('/', indexRouter);

// Obtener todos los tweets
server.get('/dashboard', function(req, res) {
    // busca todos los tweets, cuando los tengas regrésamelos. Si hubo algún error, notificalo.
    Tweet.find()
    .then((results) => {
        res.render('dashboard', {results});
    })
    .catch((err) => {
        console.log("Hubo error: " + err)
        res.status(500).json({message: err.message});
    })
})

// Subir un nuevo tweet
server.post('/', function(req, res) {
    // Obten la información recibida en la request
    const newTweet = new Tweet({
        userId: req.body.name,
        lat: req.body.latitud,
        lon: req.body.longitud,
        price: req.body.precio,
    });

    console.log(req);
    // Guardalo a la base de datos, si hay problema notifícalo
    newTweet.save()
    .then(() => {
        res.redirect('dashboard');
    })
    .catch((err)=> {
        console.log("Hubo error: " + err);
        res.json(err);
    })

})

// Borrar un tweet
server.post('/delete/:id', function(req, res){
    const idToDelete = req.params.id;           // obtén la id que viene en el URL
    
    Tweet.findByIdAndDelete(idToDelete)
    .then((deletedTweet) => {
        if (deletedTweet === null) {
            // la base de datos no encontró el tweet especificado
            res.status(200).send("Tweet no existe.");
        } else {
            res.status(200).send("Borrado exitosamente:" + deletedTweet);
        }
    })
    .catch((err) => {
        console.log("Hubo error: " + err);
        res.status(500).json({message: err.message})
    })
})

// Obtener tweets por autor
server.get('/tweets/:username', function(req, res) {
    const user = req.params.username;
    console.log("Buscando tweets del usuario: " + user);
    Tweet.find({"username": user})
    .then((results) => {
        res.json(results);
    })
    .catch((err) => {
        console.log("Hubo error:" , err);
        res.json(err);
    })
})


//server.listen(port, ()=> console.log("El servidor está corriendo en el puerto " + port));

module.exports = server;