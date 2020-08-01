CREATE FUNCTION getFiles(
	p_artistId integer, 
	p_albumId integer, 
	p_songId integer)
RETURNS TABLE (files JSON)
AS $BODY$
BEGIN
	IF p_artist_id IS NOT NULL THEN
		SELECT *
		FROM
		(SELECT json_build_object('Key', image) as files
		FROM artists
		WHERE id = p_artist_id
		UNION
		SELECT json_build_object('Key', image) as files
		FROM albums
		WHERE artist_id = p_artist_id
		UNION
		SELECT json_build_object('Key', file) as files
		FROM songs s 
		JOIN albums a ON a.id = s.album_id
		WHERE a.artist_id = p_artist_id) as files;
    END IF;
    
    IF p_album_id IS NOT NULL THEN
		SELECT *
		FROM
		(SELECT json_build_object('Key', image) as files
		FROM albums
		WHERE id = p_album_id
		UNION
		SELECT json_build_object('Key', file) as files
		FROM songs s 
		WHERE album_id = p_album_id) as files;
    END IF;
    
	IF p_song_id IS NOT NULL THEN
		SELECT *
		FROM
		(SELECT json_build_object('Key', file) as files
		FROM songs s 
		WHERE id = p_song_id) as files;
    END IF;
END
$BODY$
LANGUAGE plpgsql;