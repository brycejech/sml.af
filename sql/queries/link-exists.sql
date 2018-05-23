
SELECT exists
(
    SELECT 1 FROM link WHERE url=$1
)
AS exists;
