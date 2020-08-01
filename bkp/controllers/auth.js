
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var sql = require('../services/postgres');
var User = require('../models/user');

exports.signup = (req, res) => {

	var params = req.body; //Tomo los datos que llegan por POST

	if(params.password){
		//Si llega la contraseña la encripto y guardo el usuario
		bcrypt.hash(params.password, null, null, async function(err, hash){
			if(params.name != null || params.surname != null || params.email !=null || 
				params.name == '' || params.surname == '' || params.email ==''){
				//Guardar usuario en BD mysql
				let user = new User(null, params.name, params.surname, params.email, 2, null, hash, null);
				try{
					let saved = await user.save()
					if(saved.rowCount == 1){
						res.send(saved.rows[0])
					}
					else throw "User could not be inserted";
				}
				catch(ex){
					console.log("auth.signup exception: ", ex.message)
					res.status(500).send({"message": ex.message})
				}
				
			}
			else{
				res.status(400).send({message: 'Completa los campos obligatorios'});
			}
		});
	}
	else{
		res.status(400).send({message: 'Introduce la contraseña'});
	}
}

exports.signin = (req, res) => {

	var params = req.body;

	var email = params.email;
	var password = params.password;

	if(email=='' || password==''){
		return res.status(500).send({message: 'Debe ingresar sus credenciales'});
	}
	else{
		sql.query('select u.id, u.name,u.surname,u.email,u.password,u.image_path,u.image_url,r.description as role from users u inner join role r on r.id = u.role_id where u.email = $1;', [email], (err, results) => {
			if(err) res.status(500).send({message: 'Usuario y/o contraseña incorrectos'});
			else{
				if(results.length == 0){
					return res.status(401).send({message: 'Usuario y/o contraseña incorrectos'});
				}
				//console.log("results: ", results)
				bcrypt.compare(password, results.rows[0].password, (err,check) => {
					if(check){
						//Devolver datos del usuario logueado
						if(params.gethash){ //Codigo para gestionar tokens
							//devolver un token jwt

							jwt.createToken(results.rows[0], (token) => {
								res.status(token.code).send({ 'getLoginTokenResult' : token.description })
							})

						}
						else{
							res.status(200).send({user: results.rows[0]});
						}
					}
					else{
						res.status(401).send({message: 'Usuario y/o contraseña incorrectos'});
					}
				});
			}
		});
	}
}