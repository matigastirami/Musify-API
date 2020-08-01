'use strict'

var express = require('express');
var authController = require('../controllers/auth')
var api = express.Router();

api.post('/signup', authController.signup)
api.post('/signin', authController.signin)

module.exports = api