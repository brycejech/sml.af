SELECT
    id,
    url,
    short_url,
    permalink,
    created

FROM link

WHERE short_url=$1;
