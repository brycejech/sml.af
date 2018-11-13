
SELECT
	link.id,
    link.url,
    link.hash,
    link.created,
    link.created_timestamp,

	nextval.id AS next_id

FROM
(
	SELECT
		id,
		url,
		hash,
		created,
        created_timestamp
	FROM
		link
	WHERE
        url=$1
    LIMIT 1

) AS link

RIGHT OUTER JOIN
(
	SELECT
	-- here I'd like to reference results.url rather than rescanning the whole table to re-check existence of the url match
	-- however, it won't let me reference 'results' in this way... :(
	-- CASE WHEN link.url THEN NULL ELSE nextval('link_id') END as next_id
	CASE WHEN exists( SELECT 1 FROM link WHERE url=$1 ) THEN NULL ELSE nextval('link_id') END as id
)
AS nextval ON true
;
