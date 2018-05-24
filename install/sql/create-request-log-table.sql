

DROP TABLE IF EXISTS request_log CASCADE;

CREATE TABLE request_log
(
    id                        bigserial PRIMARY KEY,
    ip                        text,
    origin                    text,
    referrer                  text,
    browser                   text,
    browser_version           varchar(11), -- xxx.xxx.xxx
    operating_system          text,
    operating_system_version  varchar(11), -- xxx.xxx.xxx
    device                    text,
    device_version            varchar(11), -- xxx.xxx.xxx
    user_agent_string         text,
    host                      text,
    req_url                   text,
    short_url                 varchar(50),
    link_id                   bigint,
    request_time              TIMESTAMP  DEFAULT now()::timestamp
);
