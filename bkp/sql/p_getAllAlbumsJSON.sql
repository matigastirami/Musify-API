CREATE PROCEDURE getAllAlbumsJSON()
LANGUAGE SQL
AS $$
	SELECT json_build_object(
		'id', al.id,
		'title', al.title,
		'description', al.description,
		'date_release', al.date_release,
		'artist_id', al.artist_id,
		'image', al.image,
		'image_url', al.image_url,
		'artist', json_build_object('id', ar.id, 'name', ar.name, 'description', ar.description, 'image_url', ar.image_url)
	) as album
	FROM albums al
	INNER JOIN artists ar ON ar.id = al.artist_id;
$$;