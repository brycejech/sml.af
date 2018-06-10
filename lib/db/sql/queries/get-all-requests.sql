SELECT
    -- requestor info
    ip,
    origin,
    referer,
    -- browser, os, and device
    browser,
    browser_version,
    operating_system,
    operating_system_version,
    device,
    device_version,
    user_agent_string,

    -- host info
    host,
    req_url,

    -- link info
    short_url,
    link_id

FROM request_log;
