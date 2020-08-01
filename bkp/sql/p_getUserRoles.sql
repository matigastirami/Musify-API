CREATE PROCEDURE getUserRoles(pID INT)
LANGUAGE SQL
AS $BODY$
	SELECT json_build_object(
		'id', id,
        'description', description) as role
    FROM role
    WHERE (id = pID OR pID IS NULL)
		AND endDate IS NULL;
$BODY$;