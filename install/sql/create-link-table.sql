
DROP TABLE IF EXISTS link CASCADE;

CREATE TABLE link
(
    id       BIGINT     PRIMARY KEY,
    link     TEXT       UNIQUE NOT NULL,
    url      TEXT       NOT NULL,
    created  TIMESTAMP  DEFAULT now()::timestamp
);
