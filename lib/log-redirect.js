'use strict';

const userAgent = require('useragent'),
      URL       = require('url');

const db        = require('./db'),
      queries   = db.queries;

module.exports = async function logRedirect(req, res, next){

    const headers = req.headers,
          locals  = res.locals,
          ua      = userAgent.parse(headers['user-agent']);

    if(!res.locals.link.url) return next();

    let referer;
    if(headers['referer']){
        const refUrl = URL.parse(headers['referer']);
        referer = refUrl.hostname;
    }

    var d = {
        // requestor info
        ip:         headers['x-forwarded-for'] || headers['x-real-ip'] || req.connection.remoteAddress,
        origin:     headers['origin']  || undefined,
        referer:   referer,
        // browser, os, and device
        browser:                ua.family,
        browserVersion:         ua.toVersion(),
        operatingSystem:        ua.os.family,
        operatingSystemVersion: ua.os.toVersion(),
        device:                 ua.device.family,
        deviceVersion:          ua.device.toVersion(),
        userAgentString:        headers['user-agent'],

        // host info
        host:       headers['host'] || undefined,
        reqURL:    req.protocol + '://' + headers['host'] + req.url,

        // link info
        hash:      req.params.link,
        linkID:    res.locals.link.id || undefined
    }

    const query = queries.logRequest;

    const values = [
        // requestor info
        d.ip, d.origin, d.referer,
        // browser, os, and device
        d.browser, d.browserVersion,
        d.operatingSystem, d.operatingSystemVersion,
        d.device, d.deviceVersion,
        d.userAgentString,

        // host info
        d.host,
        d.reqURL,

        // link info
        d.hash,
        d.linkID
    ];

    try{
        const result = await db.query(queries.logRequest, values);
        return next();
    }
    catch(e){
        console.log('Error logging request:');
        console.log(e);

        return next(e);
    }
}
