'use strict'

var S3Bucket = require('../services/S3Bucket');
var moment = require('moment');
var Album = require('../models/album')
var Helper = require('../helpers/ServiceHelper')

async function getAlbum(req, res) {
    try {
        let result = await Album.find(req.query.id , req.query.title, req.query.description, req.query.date_release, req.query.artist);
        res.status(200).send(result.rows);
    } catch (ex) {
        res.status(500).send({"message": ex.message});
    }
}

async function saveAlbum(req, res) {

    var params = req.body;

    if(!params.title || params.title.trim() == ''){
        res.status(400).send({ 'message' : 'You must send the album title'})
    }
    else if(!params.description || params.description.trim() == ''){
        res.status(400).send({ 'message' : 'You must send the album description'})
    }
    else if((typeof params.date_release) != 'string' || !params.date_release || params.date_release.trim() == ''){
        res.status(400).send({ 'message' : 'You must send the release date' })
    }
    else if((typeof params.date_release) != 'string' || !(moment(params.date_release, "DD/MM/YYYY").isValid())){
        res.status(400).send({ 'message' : 'You must send a valid release date (DD/MM/YYYY)' })
    }
    else if(!params.artist_id || params.artist_id.trim() == ''){
        res.status(400).send({ 'message' : 'You must send the artist' })
    }
    else{
        try {
            let album = new Album(null,
                params.title,
                params.description,
                moment(params.date_release, "DD/MM/YYYY").format("YYYY-MM-DD"),
                params.artist_id,
                null,
                null
            );
    
            let exists = await Album.find(null, params.title, null, null, null);

            if(exists.rowCount != 0){
                return res.status(400).send({"message": "Album title already exists"})
            }

            let saved = await album.save()

            if(saved.rowCount == 0){
                return res.status(500).send({"message": "Couldn't create the album"})
            }

            return res.status(200).send(saved.rows)
        } catch (ex) {
            return res.status(500).send({"message": ex.message})
        }
    }
}

async function updateAlbum(req, res) {

    var update = req.body;

    if(!req.params.id){
      res.status(400).send({ 'message' : 'Debe ingresar el id del álbum' })
    }
    else if(update.title == '' || !update.title){
        res.status(400).send({ 'message' : 'Debe ingresar el título del álbum' })
    }
    else if(update.description == '' || !update.description){
        res.status(400).send({ 'message' : 'Debe ingresar la descripción del álbum' })
    }
    else if(!update.date_release || update.date_release.trim() == ''){
        res.status(400).send({ 'message' : 'Debe ingresar una fecha de lanzamiento' })
    }
    else if(!(moment(update.date_release, "DD/MM/YYYY").isValid())){
        res.status(400).send({ 'message' : 'Debe ingresar una fecha de lanzamiento válida' })
    }
    else {

        try {
            let album = new Album(
                req.params.id,
                update.title,
                update.description,
                moment(update.date_release, "DD/MM/YYYY").format("YYYY-MM-DD"),
                update.artist_id,
                null,
                null
            );
    
            let exists = await Album.find(null, update.title, null, null, null);

            if(exists.rowCount != 0 && exists.rows[0].albums._id != req.params.id){
                return res.status(400).send({"message": "Album title already exists"})
            }

            let updated = await album.update()

            if(updated.rowCount == 0){
                return res.status(500).send({"message": "Couldn't update the album"})
            }

            return res.status(200).send(updated.rows)
        } catch (ex) {
            return res.status(500).send({"message": ex.message})
        }
    }
}

async function deleteAlbum(req, res) {
    try {
        let album = new Album(
            req.params.id,
            null,
            null,
            null,
            null,
            null,
            null
        );

        let exists = await Album.find(req.params.id, null, null, null, null);

        if(exists.rowCount == 0){
            return res.status(404).send({"message": "Album doesn't exists"})
        }

        let deleted = await album.delete()

        if(deleted.rowCount == 0){
            return res.status(500).send({"message": "Couldn't delete the album"})
        }

        return res.status(200).send({"message":"Album deleted successfully"})

    } catch (ex) {
        //console.log(ex)
        return res.status(500).send({"message": ex.message})
    }
}

function uploadImage(req, res) {

    if(!req.params.id){
        res.status(400).send({ 'message': 'Debe ingresar un id' })
    }
    else if(!req.files){
        res.status(400).send({ 'message': 'Debe seleccionar una imagen' })
    }
    else if(Helper.getFileExtension(req.files.image.name) !== 'jpg' && 
    Helper.getFileExtension(req.files.image.name) !== 'jpeg' && 
    Helper.getFileExtension(req.files.image.name) !== 'png'){
        res.status(400).send({ 'message': 'Los formatos admitidos son jpg, jpeg, png' })
    }
    else{
        Album.find(req.params.id, null, null, null, null, (found) => {
            if(found.code != 200){
                res.status(found.code).send(found.description)
            }
            else{
                var s3 = new S3Bucket();
                var album = new Album(
                    req.params.id, 
                    found.description.album[0].title,
                    found.description.album[0].description,
                    found.description.album[0].date_release,
                    found.description.album[0].artist_id,
                    'albums/' + Helper.getFileName(req.params.id) + '.' + Helper.getFileExtension(req.files.image.name),
                    null
                )


                s3.uploadFile(album.image, req.files.image.data, (uploadResult) => {
                    if(uploadResult.code != 200){
                        res.status(uploadResult.code).send(uploadResult.description)
                    }
                    else{
                        album.image_url = uploadResult.description.Location
                        album.update((updateResult) => {
                            if(updateResult.code != 200){
                                res.status(updateResult.code).send({
                                    'upload_new': uploadResult,
                                    'update_reg': updateResult
                                })
                            }
                            else{
                                if(found.description.album[0].image){
                                    s3.deleteFile(found.description.album[0].image, (deleteResult) => {
                                        res.status(uploadResult.code).send({
                                            'upload_new': uploadResult,
                                            'delete_old': deleteResult,
                                            'update_reg': updateResult
                                        })
                                    })
                                }
                                else{
                                    res.status(uploadResult.code).send({
                                        'upload_new': uploadResult,
                                        'update_reg': updateResult
                                    })
                                }
                            }
                        })
                    }
                }) 
            }
        })
    }
}

module.exports = {
    getAlbum,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage
}
