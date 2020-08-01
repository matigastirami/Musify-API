'use strict'

var sql = require('../services/postgres')

class Album {
	constructor(id = null, title = null, description = null, year = null, artist_id = null, image = null, image_url = null){
		this.id = id;
		this.title = title;
		this.description = description;
		this.year = year;
		this.artist_id = artist_id;
		this.image = image;
		this.image_url = image_url;
	}

	static find(id = null, title = null, description = null, date_release = null, artist_id = null){
		return sql.query('SELECT getAlbumJSONFilter($1, $2, $3, $4, $5) as albums;', [id, title, description, date_release, artist_id])
	}

	save(){
		return sql.query(
            'insert into albums (title, description, date_release, artist_id) values ($1, $2, $3, $4) RETURNING *', 
			[this.title, this.description, this.year, parseInt(this.artist_id)]
		);
	}

	update (){
		return sql.query(
			'UPDATE albums set title = $1, description = $2, date_release = $3, image = $4, image_url = $5 WHERE id = $6 RETURNING *',
			[this.title, this.description, this.year, this.image, this.image_url, this.id]
		);
	}

	delete(){
		return sql.query('delete from albums where id = $1', [this.id]);
	}
}

module.exports = Album
