'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var is_admin = require('../middlewares/is_admin').is_admin

api.get('/album', AlbumController.getAlbum);
api.post('/album', is_admin, AlbumController.saveAlbum);
api.put('/album/:id', is_admin, AlbumController.updateAlbum);
api.delete('/album/:id?', is_admin, AlbumController.deleteAlbum);
api.post('/album/image/:id?', is_admin, AlbumController.uploadImage);

module.exports = api;