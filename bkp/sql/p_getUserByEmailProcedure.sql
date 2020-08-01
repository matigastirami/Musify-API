CREATE PROCEDURE getUserByEmail(email varchar(50))
LANGUAGE SQL
AS $BODY$
	select 
		u.id,
		u.name,
		u.surname,
		u.email,
		/*u.image,*/
		u.image_url,
		r.description
	from users u
	inner join role r on r.id = u.role_id
	where u.email = email;
$BODY$;