
SELECT
    id,
    url,
    short_url,
    permalink,
    created

FROM link

WHERE url=$1;
