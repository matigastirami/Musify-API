'use strict'

var sql = require('../services/postgres')

class Artist {
	constructor(id, name, description, image, image_url){
		this.id = id;
		this.name = name;
		this.description = description;
		this.image = image;
		this.image_url = image_url;
	}

	static existsByName(name){
		return sql.query('SELECT * FROM artists WHERE name LIKE $1',[name]);
	}

	static find(id, name, description){
		return sql.query('SELECT getArtistsJSON($1, $2, $3) as artists', [id, name, description]);
	}

	save(){
		return sql.query('INSERT INTO artists (name, description) values ($1, $2) RETURNING *', [this.name, this.description]);
	}

	update (){
		return sql.query('UPDATE artists SET name = $1, description = $2, image = $3, image_url = $4 WHERE id = $5 RETURNING *', 
			[this.name, this.description, this.image, this.image_url, this.id]
		);
	}

	delete(){
		return sql.query('DELETE FROM artists WHERE id = $1', [this.id]);
	}

	static getFilesTree(id, done){
		sql.query('CALL `musify_dev`.getFiles(?, null, null)', [id], (err, results, fields) => {
			if(err){
				done({
					'code': 500,
					'description': {
						'message': 'Error de servidor'
					}
				})
			}
			else{
				if(results[0].length == 0){
					done({
						'code': 404,
						'description': {
							'message': 'No hay archivos asociados'
						}
					})
				}
				else{
					done({
						'code': 200,
						'description': {
							'results': 
							results[0].map(obj => {
								return JSON.parse(obj.files)
							})
						}
					})
				}
			}
		})
	}
}

module.exports = Artist
