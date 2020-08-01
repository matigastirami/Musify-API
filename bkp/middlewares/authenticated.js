'use strict'

var jwt = require('../services/jwt');

exports.ensureAuth = function(req, res, next){
	//Este método comprueba si los datos del token que llega son correctos
	//El parametro next es para salir del middleware

	console.log(req.method)

	if(req.method === 'OPTIONS'){
		return res.status(200).end();
	}

	if(!req.headers.authorization){ //si no lega el header en la peticion
		return res.status(403).send({'message': 'La petición no tiene la cabecera de autenticación'});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');

	jwt.decodeToken(token, (result) => {
		if(result.status != 'OK'){
			res.status(result.code).send({ 'description': result.description })
		}
		else{
			req.user = result.description.payload;
			return next(); //Sale del middleware
		}	
	})	

};