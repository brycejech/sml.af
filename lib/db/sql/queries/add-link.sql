
INSERT INTO link
    (id, url, hash)
VALUES
    ($1, $2, $3)
RETURNING *
;
