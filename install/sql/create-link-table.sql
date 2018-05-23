
DROP TABLE IF EXISTS link CASCADE;

CREATE TABLE link
(
    id         BIGINT     PRIMARY KEY,
    url        TEXT       NOT NULL,
    short_url  TEXT       NOT NULL,
    created    TIMESTAMP  DEFAULT now()::timestamp
);
