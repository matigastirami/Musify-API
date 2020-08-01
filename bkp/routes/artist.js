'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();

api.get('/artist', ArtistController.getArtist);
api.post('/artist', ArtistController.saveArtist);
api.put('/artist/:id?', ArtistController.updateArtist);
api.delete('/artist/:id', ArtistController.deleteArtist);
api.post('/artist/image/:id', ArtistController.uploadImage);

module.exports = api;