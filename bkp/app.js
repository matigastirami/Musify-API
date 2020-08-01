/*
* Directorio: '/'
* Tarea: Eje principal de la aplicación, carga rutas y configuraciones de las librerias, etc
*/
var express = require('express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var app = express();

//Cargar rutas
var user_routes = require('./routes/user'); //Trae todas las rutas que estén en user.js
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');
var auth_routes = require('./routes/auth');
var role_routes = require('./routes/role')

// Auth middleware
var md_auth = require('./middlewares/authenticated').ensureAuth

//Configurar body-parser primero

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //Convierte a json las peticiones que llegan por http

//Configuración de fileUpload
app.use(fileUpload());

//configurar cabeceras http
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
	res.header('Allow', 'GET, POST, OPTIONS, DELETE, PUT');
	next();
});

app.use((req,res,next) => {
	console.log("\n\n \\****** NEW REQUEST: ******\\ \n",
		{ 
			'Method': req.method, 
			'Body': req.body,
			'Params': req.params,
			'Query': req.query,
			'URL': req.url,
			'IP': req.ip
		}
	)
	next()
})

//rutas base
app.use('/auth', auth_routes);
app.use('/api', md_auth);
app.use('/api', user_routes); //Cualquier solicitud vía http se le agrega '/api' en la url
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);
app.use('/api', role_routes);

module.exports = app;