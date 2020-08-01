CREATE PROCEDURE getAlbumJSONFilter(
	albumID INT, 
	albumTitle VARCHAR(50), 
	albumDescription varchar(50), 
	yearRelease INT, 
	artistID INT
)
LANGUAGE SQL
AS $$
	SELECT json_build_object(
		'_id', a.id,
		'title', a.title,
		'description', a.description,
		'date_release', a.date_release,
		'artist_id', a.artist_id,
		'image', a.image,
		'image_url', a.image_url,
		'artist', json_build_object(
			'_id', ar.id,
			'name', ar.name,
			'description', ar.description,
			'image', ar.image,
			'image_url', ar.image_url)) as album
	FROM albums a 
	INNER JOIN artists ar ON ar.id = a.artist_id
    WHERE (a.id = albumID OR albumID IS NULL)
		AND (a.title LIKE CONCAT('%',albumTitle,'%') OR albumTitle IS NULL)
        AND (a.description LIKE CONCAT('%',albumDescription,'%') OR albumDescription IS NULL)
        AND (EXTRACT(YEAR FROM a.date_release) = yearRelease OR yearRelease IS NULL)
        AND (a.artist_id = artistID OR artistID IS NULL);
$$;