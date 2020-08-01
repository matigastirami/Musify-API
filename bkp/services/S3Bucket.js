var aws = require('aws-sdk')
var config = require('../config/config')

class S3Bucket{
    constructor(){

        this.s3 = new aws.S3({ 
            params: {
                Bucket: config.S3_BUCKET } 
        })

        aws.config.update({
            accessKeyId: config.S3_ACCESSKEYID,
            secretAccessKey:config.S3_SECRETACCESSKEY
        })
    }

    uploadFile(file_name, file_buffer, UploadResult){
        try {
            this.s3.upload({ Key: file_name, Body: file_buffer, ACL: 'public-read' }, (err, data) => {
                if(err) 
                    throw err
                else{
                    UploadResult({
                        'code' : '200', 
                        'description': {
                            'message': 'Archivo cargado satisfactoriamente',
                            'Key': data.Key,
                            'Location': data.Location
                        }
                    })
                }
            })
        } catch (ex) {
            console.log(ex)
            UploadResult({
                'code' : '500', 
                'description': {
                    'message': 'No se pudo cargar el archivo'
                }
            })
        }
    }

    deleteFile(file_name, deleteResult){
        try {
            this.s3.deleteObject({ Key: file_name }, (err, data) => {
                if(err){
                    throw err
                }
                else{
                    if(!data){
                        deleteResult({
                            'code': '404', 
                            'description': {
                                'message': 'Error al intentar eliminar el archivo',
                                data
                            }
                        });
                    }
                    else{
                        deleteResult({
                            'code': '200', 
                            'description': {
                                'message': 'Archivo eliminado correctamente',
                            }
                        });
                    }
                }
            });
        } catch (error) {
            deleteResult({
                'code': '500', 
                'description': {
                    'message': 'Error de servidor',
                }
            });
        }
    }

    deleteFiles(array_file_names, deleteResult){
        console.log(params)

        var params = {
            Delete:{
                Objects: array_file_names
            }
        };

        try {
            this.s3.deleteObject({ Key: file_name }, (err, data) => {
                if(err){
                    throw err
                }
                else{
                    if(!data){
                        deleteResult({
                            'code': '404', 
                            'description': {
                                'message': 'Error al intentar eliminar el archivo',
                                data
                            }
                        });
                    }
                    else{
                        deleteResult({
                            'code': '200', 
                            'description': {
                                'message': 'Archivo eliminado correctamente',
                            }
                        });
                    }
                }
            });
        } catch (error) {
            deleteResult({
                'code': '500', 
                'description': {
                    'message': 'Error de servidor',
                }
            });
        }
    }

    getFile(){
        //PENDIENTE DESARROLLAR
    }
}

module.exports = S3Bucket