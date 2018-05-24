INSERT INTO request_log
    (
        -- requestor info
        ip,
        origin,
        referrer,
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
    )

VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
;
