/*
* Directorio: '/controllers/user.js'
* Tarea: Contiene todos los métodos para gestionar usuarios
*/
'use strict'

const hashPassword = require('../util/hash').hashPassword;
const moment = require('moment');
const User = require('../models/user')


async function getUsers(req, res){
	// Desarrollar un get con parámetros
	try {
		let results = await User.find(req.body.id, req.body.name, req.body.surname, req.body.email, req.body.role_id)
		res.status(200).send(results.rows)
	} catch (ex) {
		res.status(500).send(ex.message)
	}

}

async function saveUser(req, res){
	var data = req.body;

	try{
		let hashedPassword = await hashPassword(data.password, 10)
		let user = new User(null, data.name, data.surname, data.email, data.role_id, null, hashedPassword, null)
		let updated = await user.update()
	
		if(updated.rowCount == 1){
			return res.status(200).send(updated.rows[0])
		}
		else{
			return res.status(404).send({"message": "usuario no encontrado"})
		}
	}
	catch(ex){
		return res.status(500).send(ex.message)
	}
}

async function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;
	
	try{
		
		let user = new User(userId, update.name, update.surname, update.email, update.role_id, null, hashedPassword, null)
		let updated = await user.update()
	
		if(updated.rowCount == 1){
			return res.status(200).send(updated.rows[0])
		}
		else{
			return res.status(404).send({"message": "usuario no encontrado"})
		}
	}
	catch(ex){
		return res.status(500).send(ex.message)
	}
	
}

/* Pendiente implementar algun servicio para subir las imágenes */
function uploadImage(req,res){
	
	var userId = req.params.id;
	var file_name = 'No subido';

	var data = {
		Key: userId + '_' + moment().format("DD-MM-YYYY_HH-mm-ss"),
		Body: (req.files.image.data),
		ACL: 'public-read'
	}

	
}

// Metodo en desuso por el momento
async function deleteUser(req, res) {
	var userId = req.params.id;
	
	try{
		
		let user = new User(userId, null, null, null, null, null, null, null)
		let deleted = await user.delete()
	
		if(deleted.rowCount == 1){
			return res.status(200).send({"message": "Usuario eliminado con éxito"})
		}
		else{
			return res.status(404).send({"message": "usuario no encontrado"})
		}
	}
	catch(ex){
		return res.status(500).send(ex.message)
	}
}


module.exports = {
	getUsers,
	saveUser,
	updateUser,
	uploadImage,
    deleteUser
};