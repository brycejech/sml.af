
DROP TABLE IF EXISTS link CASCADE;

CREATE TABLE link
(
    id         bigint     PRIMARY KEY,
    url        text       NOT NULL,
    short_url  text       NOT NULL,
    permalink  text       NOT NULL,
    created    timestamp  DEFAULT now()::timestamp
);
