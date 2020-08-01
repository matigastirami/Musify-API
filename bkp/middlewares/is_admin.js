'use strict'

exports.is_admin = (req, res, next) => {

    //console.log(req.user)
    
    if(req.user.role != 'ADMIN'){
        res.status(401).send({ 'message': 'No tiene permisos para realizar esta acción' })
    }
    else{
        next()
    }
} 