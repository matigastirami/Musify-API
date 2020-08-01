CREATE OR REPLACE FUNCTION getjsonsongbyid(
	p_songid integer,
	p_albumid integer,
	p_number integer,
	p_name varchar(50)
)
    RETURNS TABLE(song json) 
    LANGUAGE SQL

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
	SELECT json_build_object(
		'_id', s.id,
        'file', s.file,
        'fileURL', s.file_url,
        'duration', to_char(duration, 'HH12:MI:SS'),
        'name', s.name,
        'number', s.number,
        'album', json_build_object(
			'_id', a.id,
            'artist', a.artist_id,
            'imageURL', a.image_url,
            'image', a.image,
            'year', a.date_release,
            'description', a.description,
            'title', a.title
        )
    ) as song
    FROM songs s
    INNER JOIN albums a ON a.id = s.album_id
    WHERE (s.id = p_songID OR p_songID IS NULL)
    AND (s.album_id = p_albumID OR p_albumID IS NULL)
	AND (s.number = p_number OR p_number IS NULL)
	AND (s.name = p_name OR p_name IS NULL);
$BODY$;
