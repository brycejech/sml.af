'use strict';

const http  = require('http'),
      https = require('https');

function getRequestAgent(url){
    if(/^https/.test(url))    return https;
    if(/^http[^s]/.test(url)) return http;
    return null;
}

async function hasRedirectOrTimeout(url){
    const timeout = 10000; // in seconds

    return new Promise((resolve, reject) => {
        const agent = getRequestAgent(url);
        if(agent){
            const request = agent.get(url, (res) => {
                const { statusCode } = res;
                if(statusCode > 300 && statusCode < 400){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            });

            request.on('error', (e) => {
                resolve(true)
            });

            request.on('socket', socket => {
                socket.setTimeout(timeout);
                socket.on('timeout', () => { request.abort() });
            });

            request.end();
        }
        else{
            // TODO
            // - fix how this is handled, just kill request for now
            return true;
        }

    });

}

module.exports = hasRedirectOrTimeout;
