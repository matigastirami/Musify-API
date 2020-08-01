'use strict'

const Song = require('../models/song');
const S3Bucket = require('../services/S3Bucket');
const ServiceHelper = require('../helpers/ServiceHelper')
const mp3duration = require('mp3-duration');
const Album = require('../models/album');


async function getSong(req, res) {
    try {
        let result = await Song.find(req.query.id, req.query.album)
        res.status(200).send(result.rows);
    } catch (ex) {
        res.status(500).send({"message": ex.message});
    }
}

async function saveSong(req, res) {

    if(!req.body.number || req.body.number < 0){
        return res.status(400).send({"message": "You must send the song number (Order)"})
    }
    if(!req.body.name || req.body.name.trim() == ""){
        return res.status(400).send({"message": "You must send the song name"})
    }
    if(!req.body.duration || req.body.duration.trim() == ""){
        return res.status(400).send({"message": "You must send the song name"})
    }
    if(!req.body.album_id || req.body.album_id == ""){
        return res.status(400).send({"message": "You must send the album"})
    }

    try {

        var song = new Song(
            null,
            req.body.number,
            req.body.name,
            req.body.duration,
            req.body.album_id
        );

        let albumExists = await Album.find(req.body.album_id, null, null, null, null);

        if(albumExists.rowCount == 0){
            return res.status(400).send({"message": "Album does not exists"})
        }

        let songExists = await Song.find(null, req.body.album_id, req.body.number, null);

        if(songExists.rowCount == 1){
            return res.status(400).send({"message": "Song already exists in this album"})
        }

        let saved = await song.save()

        if(saved.rowCount == 0){
            throw "Couldn't save the song"
        }

        return res.status(200).send(saved.rows[0])
    } catch (ex) {
        return res.status(500).send({"message": ex.message})
    }
}

async function updateSong(req, res) {

    if(!req.params.id){
        return res.status(400).send({"message": "You must send the song id"})
    }
    if(!req.body.number || req.body.number < 0){
        return res.status(400).send({"message": "You must send the song number (Order)"})
    }
    if(!req.body.name || req.body.name.trim() == ""){
        return res.status(400).send({"message": "You must send the song name"})
    }
    if(!req.body.duration || req.body.duration.trim() == ""){
        return res.status(400).send({"message": "You must send the song name"})
    }
    if(!req.body.album_id || req.body.album_id == ""){
        return res.status(400).send({"message": "You must send the album"})
    }

    try {

        var song = new Song(
            req.params.id,
            req.body.number,
            req.body.name,
            req.body.duration,
            req.body.album_id
        );

        let albumExists = await Album.find(req.body.album_id, null, null, null, null);

        if(albumExists.rowCount == 0){
            return res.status(400).send({"message": "Album does not exists"})
        }

        let songExists = await Song.find(null, req.body.album_id, req.body.number, null);

        if(songExists.rowCount == 1){
            return res.status(400).send({"message": "Song already exists in this album"})
        }

        let updated = await song.update()

        if(updated.rowCount == 0){
            return res.status(500).send({"message": "Couldn't update the song"})
        }

        return res.status(200).send(updated.rows[0])
    } catch (ex) {
        return res.status(500).send({"message": ex.message})
    }
}

async function deleteSong(req, res) {

    if(!req.params.id){
        return res.status(400).send({"message": "You must send the song id"});
    }
    try {
        var song = new Song(
            req.params.id,
            null,
            null,
            null,
            null
        );

        let deleted = await song.delete();

        if(deleted.rowCount == 0){
            return res.status(500).send({"message": "Couldn't delete the song"})
        }

        return res.status(200).send({"message":"Song deleted successfully"})

    } catch (ex) {
        return res.status(500).send({"message": ex.message})
    }
}

function uploadSong(req, res) {

    var s3 = new S3Bucket();

    if(req.files){
        if(ServiceHelper.getFileExtension(req.files.file.name) != 'mp3'){
            res.status(400).send({ 'message': 'La extensión del archivo debe ser mp3' })
        }
        else{
            Song.find(req.params.id, null, (result) => {
                if(result.code != 200){
                    res.status(result.code).send(result.description)
                }
                else{
                    console.log("result: ", result)
                    var song = new Song(
                        result.description.song[0]._id,
                        result.description.song[0].number,
                        result.description.song[0].name,
                        result.description.song[0].duration,
                        result.description.song[0].album_id,
                        result.description.song[0].file,
                        result.description.song[0].file_url
                    )

                    var oldSong = song.file

                    console.log(song)

                    mp3duration(req.files.file.data, (err, dur) => {
                        if(err) console.log("Error al calcular la duración de la canción");
                        else song.duration = ServiceHelper.valueToSQLTime(dur);
                        s3.uploadFile('songs/' + ServiceHelper.getFileName(song.id) + '.mp3', req.files.file.data, (uploadResult) => {
                            if(uploadResult.code != 200){
                                res.status(uploadResult.code).send(uploadResult.description)
                            }
                            else{
                                song.file = uploadResult.description.Key
                                song.file_url = uploadResult.description.Location
    
                                song.update((songUpdated) => {
                                    if(songUpdated.code != 200){
                                        res.status(songUpdated.code).send(songUpdated.description)
                                    }
                                    else{
                                        if(oldSong){
                                            s3.deleteFile(oldSong, (deleteResult) => {
                                                    res.status(deleteResult.code).send({'delete_old_file' : deleteResult, 'upload_new_file': uploadResult, 'update_reg': songUpdated })
                                            })
                                        } else{
                                            res.status(uploadResult.code).send({'file' : uploadResult.description, 'song' : songUpdated.description})
                                        }
                                    }
                                })
                            }
                        }) 
                    })
                }
            })
        }        
    }
    else{
        res.status(400).send({ 'message': 'Debe enviar un archivo' });
    }
}

module.exports = {
    getSong,
    saveSong,
    updateSong,
    deleteSong,
    uploadSong
}