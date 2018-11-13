SELECT
    id,
    url,
    hash,
    created,
    created_timestamp

FROM link

WHERE hash=$1;
