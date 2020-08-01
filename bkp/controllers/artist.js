'use strict'

var aws = require('../services/aws');
var config = require('../config/config');
var moment = require('moment');
var sql = require('../services/postgres')
var Artist = require('../models/artists')
var S3Bucket = require('../services/S3Bucket')

async function getArtist(req, res) {
    try {
        let results = await Artist.find(req.query.id, req.query.name, req.query.description);
        res.status(200).send(results.rows)
    } catch (ex) {
        res.status(500).send(ex.message)
    }
}

async function saveArtist(req, res) {

    let params = req.body;

    if(!params.name || params.name.trim() == ''){
        res.status(400).send({ message: 'Debe ingresar un nombre de artista' });
    }
    if(params.name.trim().length > 25){
        res.status(400).send({ message: 'El nombre de artista no debe superar los 25 caracteres' });
    }
    if(params.description.trim().length > 25){
        res.status(400).send({ message: 'El nombre de artista no debe superar los 25 caracteres' });
    }
    else if(!params.description || params.description.trim() == ''){
        res.status(400).send({ message: 'Debe ingresar una descripción para el artista' });
    }
    else {
        try {
            let artist = new Artist(null, params.name, params.description, null, null);

            let exists = await Artist.find(null, params.name, null);
    
            if(exists.rowCount != 0){
                return res.status(400).send({"message": "Artist already exists"});
            }
    
            let saved = await artist.save();
    
            if(saved.rowCount == 1)
                res.status(200).send(saved.rows[0])
        } catch (ex) {
            return res.status(500).send({"message": ex.message});
        }
    }
}

async function updateArtist(req, res) {

    var artistId = req.params.id;
    var update = req.body;
    
    if(!artistId){
        res.status(400).send({ message: 'Debe ingresar el ID del artista a eliminar' });
    }
    else if(!update.name || update.name.trim() == ''){
        res.status(400).send({message: 'Debe ingresar el nombre del artista'});
    }
    else if(!update.description || update.description.trim() == ''){
        res.status(400).send({message: 'Debe ingresar la descripcion del artista'});
    }
    else{
        try {
            let artist = new Artist(artistId, update.name, update.description, null, null);

            let exists = await Artist.find(null, update.name, null);
    
            if(exists.rowCount != 0 && exists.rows[0].artists.id != artistId){
                return res.status(400).send({"message": "Artist already exists"});
            }
    
            let updated = await artist.update()
    
            if(updated.rowCount == 1){
                return res.status(200).send(updated.rows);
            }
        } catch (ex) {
            return res.status(500).send({"message": ex.message});
        }
    }
}

async function deleteArtist(req, res) {

    if(!req.params.id){
        res.status(400).send({
            'message': 'Debe enviar un id'
        })
    }
    else {
        try {
            let artist = new Artist(req.params.id, null, null, null, null);

            let exists = await Artist.find(req.params.id, null, null);
    
            if(exists.rowCount == 0){
                return res.status(404).send({"message": "Artist doesn't exists"});
            }
    
            let deleted = await artist.delete();
    
            if(deleted.rowCount == 1){
                return res.status(200).send({"message":"Artist deleted succesfully"});
            }
        } catch (ex) {
            return res.status(500).send({"message": ex.message});
        }
    }    
}

function uploadImage(req, res) {

    var artistId = req.params.id;
    var file_name = 'No subido';

    var s3 = new aws.S3({ params: {Bucket: config.S3_BUCKET + '/artists' } });

    var data = {
        Key: artistId + '_' + moment().format("DD-MM-YYYY_HH-mm-ss"),
        Body: (req.files.image.data),
        ACL: 'public-read'
    }

    var artistUpdated = null;

    sql.query('SELECT * FROM artists WHERE id = ?', [artistId], (err, reg, field) => {
        if(!err){
            artistUpdated = reg[0]
        }
    })

    if (req.files) {

        var file_name = req.files.image.name;

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[ext_split.length -1]; //Tomo la extensión del archivo

        //Valido si la extensión corresponde a una de las imagenes subidas
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            data.Key += ('.' + file_ext);
            
            s3.upload(data, (err, data) => {
                if(err){
                    res.status(500).send({message: err});
                }
                else{
                    if(!data){
                        res.status(404).send({message: 'No se encontró el bucket'});        
                    }
                    else{           

                        //Una vez subida la imagen busco el usuario y actualizo el campo image con la url del bucket
                        sql.query('UPDATE artists SET image = ?, image_url = ? WHERE id = ?', 
                        [data.Key, data.Location, artistId],
                        (err, result, field) => {
                            if(err){
                                res.status(500).send({ 'message': 'Error al actualizar la imagen del artista' });
                            }
                            else{
                                if(result.affectedRows == 0){
                                    res.status(404).send({ 'message': 'No se encontró el artista' });
                                }
                                else{
                                    res.status(200).send({ artist: artistUpdated });
                                }
                            }
                        })
                    }
                }
            });
        }
        else {
            res.status(500).send({ 'message': 'La extensión no corresponde a una imagen soportada' });
        }

    }
    else {
        res.status(200).send({ 'message': 'No ha subido ninguna imagen' });
    }
}

/*function getImageFile(req, res) {

    var imageFile = req.params.imageFile; //Nombre del fichero que llega por URL

    var path_file = path.join('./uploads/artists', imageFile); //Se usa el método join para securizar la subida de archivo

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file)); //Devuelvo la imagen
        }
        else {
            res.status(200).send({ 'message': 'La imagen no existe' });
        }
    });
}*/

module.exports = {
    getArtist,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
}