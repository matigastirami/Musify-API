'use strict'

var jwt = require('jsonwebtoken')
var secret = 'clave_secreta_curso'

class TokenGenerator {

	constructor(){}

	static createToken(user, result){

		var payload = {//Datos que se van a codificar
			sub: user.id,
			name: user.name,
			surname: user.surname,
			email: user.email,
			role: user.role,
			image: user.image
		};
	
		return jwt.sign(payload, secret, { expiresIn: '2h' }, (err, token) => {
			if(err){
				result({ 
					'status': 'ERR',
					'code': 500,
					'description': {
						'message': 'No fue posible realizar la autenticación'
					}
				 })
			}
			else{
				result({ 
					'status': 'OK',
					'code': 200,
					'description': {
						'message': 'Sessión generada con éxito',
						'token': token
					}
				 })
			}
		})
	}

	static decodeToken(token, result){
		jwt.verify(token, secret, (err, decoded) => {
			if(err)
				result({
					'status': 'ERR',
					'code': 400,
					'description': {
						'message': err
					}
				})
			else
				result({
					'status': 'OK',
					'code': 200,
					'description': {
						'payload': decoded
					}
				})
		})
	}
}

module.exports = TokenGenerator;