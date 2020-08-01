CREATE FUNCTION updateUserImage(
	p_user_id int, 
	img_buffer BYTEA, 
	encoding_type VARCHAR(10), 
	img_aws_path VARCHAR(150), 
	img_url VARCHAR(255))
RETURNS void
AS $BODY$
BEGIN
	if exists (SELECT 1 FROM users_images WHERE user_id = user_id) then
		UPDATE 
			users_images 
        SET 
			img_buffer = img_buffer, 
			encoding_type = encoding_type, 
            img_aws_path = img_aws_path, 
            img_url = img_url
		WHERE 
			user_id = p_user_id;
	else
		insert into 
			users_images (img_buffer, encoding_type, img_aws_path, img_url, user_id) 
		values 
			(img_buffer,encoding_type,img_aws_path,img_url,p_user_id);
    end if;
	
	RETURN;
END
$BODY$
LANGUAGE plpgsql;