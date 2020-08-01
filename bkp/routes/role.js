'use strict'

var express = require('express');
var roleController = require('../controllers/role'); //Llamo al controlador de usuarios
var is_admin = require('../middlewares/is_admin').is_admin

var api = express.Router();

//Le paso la ruta que hay que poner en la url al llamar al api
//Para usar un middleware lo llamo como segundo parámetro
api.get('/role', is_admin, roleController.getRoles);

module.exports = api