-- PROCEDURE: public.getusersjson(integer, character varying, character varying, character varying, integer)

-- DROP PROCEDURE public.getusersjson(integer, character varying, character varying, character varying, integer);

CREATE OR REPLACE function public.getusersjson(
	p_userid integer,
	p_username character varying,
	p_usersurname character varying,
	p_useremail character varying,
	p_userroleid integer)
returns table (users json)
LANGUAGE 'sql'
AS $BODY$
	SELECT 
    json_build_object('id',u.id,
		'name',	u.name,
		'surname', u.surname,
		'email', u.email,
		'role_id', u.role_id,
		'role',	r.description) AS user
	FROM users u
	INNER JOIN role r ON r.id = u.role_id
	WHERE (u.id = p_userId OR p_userId IS NULL)
		AND (name = p_userName OR p_userName IS NULL)
		AND (surname = p_userSurname OR p_userSurname IS NULL)
		AND (email = p_userEmail OR p_userEmail IS NULL)
		AND (role_id = p_userRoleId OR p_userRoleId IS NULL)
        --AND (role_id <> 1);
$BODY$;
