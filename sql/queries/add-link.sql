
INSERT INTO link
    (id, url, short_url)
VALUES
    ($1, $2, $3)
RETURNING *
;
