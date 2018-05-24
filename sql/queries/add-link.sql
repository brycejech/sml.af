
INSERT INTO link
    (id, url, short_url, permalink)
VALUES
    ($1, $2, $3, $4)
RETURNING *
;
