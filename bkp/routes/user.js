/*
* Directorio: '/'
* Tarea: Se setean las rutas de la api, para llamar a los métodos
*/

'use strict'

var express = require('express');
var userController = require('../controllers/user'); //Llamo al controlador de usuarios
var is_admin = require('../middlewares/is_admin').is_admin

var api = express.Router();

//Le paso la ruta que hay que poner en la url al llamar al api
//Para usar un middleware lo llamo como segundo parámetro
api.get('/user', is_admin, userController.getUsers);
api.post('/user', is_admin, userController.saveUser);
api.put('/user/update/:id', is_admin, userController.updateUser);
api.post('/user/image/post/:id', is_admin, userController.uploadImage);
api.delete('/user/:id', is_admin, userController.deleteUser);

module.exports = api;