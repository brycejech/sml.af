SELECT
    *
FROM
    request_log
WHERE
    short_url=$1
;
