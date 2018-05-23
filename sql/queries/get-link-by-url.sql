
SELECT
    id,
    url,
    short_url,
    created

FROM link

WHERE url=$1;
