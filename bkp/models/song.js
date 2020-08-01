'use strict'

var sql = require('../services/postgres')

class Song {
	constructor (id = null, number = null, name = null, duration = null, album_id = null, file = null, file_url = null){
		this.id = id;
		this.number = number;
		this.name = name;
		this.duration = duration;
		this.album_id = album_id;
		this.file = file;
		this.file_url = file_url;
	}

	static exists(number, album_id){
		return sql.query('SELECT 1 FROM songs where number = $1 AND album_id = $2', [number, album_id]);
	}

	static find(id = null, album_id = null, number = null, name = null){
		return sql.query('SELECT getJSONSongByID($1,$2, $3, $4) as song', [id, album_id, number, name]);
	}

	save(){
		return sql.query(
			'insert into songs (number, name, duration, file, file_url, album_id) values ($1,$2,$3,$4,$5,$6) RETURNING *', 
			[this.number, this.name, this.duration, this.file, this.file_url, this.album_id]
		);
		
	}

	update(){
		return sql.query(
			'UPDATE songs SET number = $1, name = $2, file = $3, file_url = $4, duration = $5 WHERE id = $6 RETURNING *',
			[this.number, this.name, this.file, this.file_url, this.duration, this.id]
		);
	}

	delete(){
		return sql.query('DELETE FROM songs WHERE id = $1', [this.id]);
	}
}

module.exports = Song;
