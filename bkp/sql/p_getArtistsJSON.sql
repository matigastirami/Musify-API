CREATE FUNCTION getAlbumJSONFilter(
	p_albumID INT, 
	p_albumTitle VARCHAR(50), 
	p_albumDescription varchar(50), 
	p_date_release TIMESTAMP, 
	p_artistID INT)
RETURNS TABLE (albums JSON)
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
			'image_url', ar.image_url)) as albums
	FROM albums a 
	INNER JOIN artists ar ON ar.id = a.artist_id
    WHERE (a.id = p_albumID OR p_albumID IS NULL)
		AND (a.title LIKE CONCAT('%',p_albumTitle,'%') OR p_albumTitle IS NULL)
        AND (a.description LIKE CONCAT('%',p_albumDescription,'%') OR p_albumDescription IS NULL)
        AND (a.date_release = p_date_release OR p_date_release IS NULL)
        AND (a.artist_id = p_artistID OR p_artistID IS NULL);
$$