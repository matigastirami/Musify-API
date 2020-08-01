
var sql = require('../services/postgres')

class Role {
    constructor(id, description){
        this.id = id
        this.description = description
    }

    static find(id = null, done){
        sql.query('CALL `musify_dev`.getUserRoles(?)', [id], (err, result, fields) => {
            if(err){
                done({
                    'code': 500,
                    'description': {
                        'message': 'Error de servidor'
                    }
                })
            }
            else{
                if(result[0].length == 0){
                    done({
                        'code': 404,
                        'description': {
                            'message': 'No se encontraron registros'
                        }
                    })
                }
                else{
                    done({
                        'code': 200,
                        'description': {
                            'role': result[0].map(obj => {return JSON.parse(obj.role)})
                        }
                    })
                }
            }
        })
    }

    static exists(id = null, name = null){

    }
}

module.exports = Role