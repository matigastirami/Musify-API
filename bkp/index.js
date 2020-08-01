/*
* Directorio: '/'
* Tarea: Connectar a la BD y levantar APP
*/

'use strict'

const config = require('config');
const app = require('./app');
const port = config.get("PORT");
require('dotenv').config();

app.listen(port, function(){
	console.log(`Listening on http://localhost:${port}`);
	console.log(process.env.NODE_ENV)

});

module.exports = app;