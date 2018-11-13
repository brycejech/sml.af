
DROP TABLE IF EXISTS link CASCADE;

CREATE TABLE link
(
    id                bigint      PRIMARY KEY,
    url               text        NOT NULL,
    hash              text        NOT NULL,

    created           timestamptz DEFAULT (now() at time zone 'utc'),
    created_timestamp bigint      DEFAULT extract(epoch from now() at time zone 'utc') * 1000
);
