'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var is_admin = require('../middlewares/is_admin').is_admin
var api = express.Router();

api.get('/song/', SongController.getSong);
api.post('/song', is_admin, SongController.saveSong);
api.put('/song/:id', is_admin, SongController.updateSong);
api.delete('/song/:id', is_admin, SongController.deleteSong);
api.post('/song/file/:id', is_admin, SongController.uploadSong);

module.exports = api;