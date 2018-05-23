SELECT
    id,
    url,
    short_url,
    created

FROM link

WHERE short_url=$1;
