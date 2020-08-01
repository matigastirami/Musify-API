'use strict'

var sql = require('../services/postgres')
var moment = require('moment')

class User {
	constructor(id, name, surname, email, role_id, image_path, password, image_url){
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.role_id = role_id;
		this.image_path = image_path;
		this.password = password;
		this.image_url = image_url;
	}

	static find(id = null, name = null, surname = null, email = null, role_id = null){
		return sql.query('SELECT getUsersJSON($1,$2,$3,$4,$5) as users', [id, name, surname, email, role_id])
	}

	save(){
		return sql.query('insert into users (name, surname, email, role_id, password) values ($1,$2,$3,$4,$5) RETURNING *', [this.name, this.surname, this.email, this.role_id || 2, this.password])
	}

	update(){
		return sql.query('UPDATE users SET name = $1, surname = $2, role_id = $3 WHERE id = $4 RETURNING *', [this.name, this.surname, this.role_id, this.id])
	}

	delete(id){
		return sql.query('DELETE FROM users WHERE id = $1', [this.id])
    }
    
    changePassword(){
		return "no soportado"
    }
}

export default User;
