

DROP TABLE IF EXISTS request_log CASCADE;

CREATE TABLE request_log
(
    id                        bigserial PRIMARY KEY,
    ip                        text,
    origin                    text,
    referer                   text,
    browser                   text,
    browser_version           varchar(11), -- xxx.xxx.xxx
    operating_system          text,
    operating_system_version  varchar(11), -- xxx.xxx.xxx
    device                    text,
    device_version            varchar(11), -- xxx.xxx.xxx
    user_agent_string         text,
    host                      text,
    req_url                   text,
    hash                      varchar(50),
    link_id                   bigint,
    request_time              timestamptz DEFAULT (now() at time zone 'utc'),
    request_timestamp         bigint      DEFAULT extract(epoch from now() at time zone 'utc' at time zone 'utc')
);
