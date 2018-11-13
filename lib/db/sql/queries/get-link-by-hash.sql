SELECT
    id,
    url,
    hash,
    created,
    created_timestamp

FROM link

WHERE short_url=$1;
