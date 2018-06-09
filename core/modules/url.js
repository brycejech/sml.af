'use strict';

const conf = require('../../conf');

const http    = require('http'),
      { URL } = require('url'),
      request = require('request');

const threatTypeMap = {
    MALWARE: 'Malware',
    SOCIAL_ENGINEERING: 'Social Engineering',
    UNWANTED_SOFTWARE:  'Unwanted Software',
    POTENTIALLY_HARMFUL_APPLICATION: 'Potentially Harmful Application'
}


function redirectInQueryString(url){
    const exp = /\?|&redirect/i;
    return exp.test(url);
}


/*
    Uses the Google Safe Browsing API to
    check the URL against known bad domains
*/
async function isSafeURL(url){


    if(redirectInQueryString(url)){
        return {
            safe:   false,
            reason: 'URL is not safe, potential redirect in querystring.',
            url:    url
        }
    }

    const requestBody = {
        client: {
            clientId: conf.app.NAME,
            clientVersion: conf.app.VERSION
        },
        threatInfo: {
            threatTypes: [
                'MALWARE',
                'SOCIAL_ENGINEERING',
                'UNWANTED_SOFTWARE',
                'POTENTIALLY_HARMFUL_APPLICATION'
            ],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [
                { 'url': url }
            ]
        }
    }

    const baseUrl = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=',
          apiKey  = conf.app.GOOGLE_API_KEY;

    const requestUrl = baseUrl + apiKey;

    const requestOpts = {
        url: requestUrl,
        json: true,
        body: requestBody,
        agentOptions: {
            secureProtocol: 'TLSv1_2_method'
        }
    }

    return new Promise((resolve, reject) => {
        request.post(requestOpts, (err, response, body) => {
            if(err) return reject(err);

            if(body && body.matches){
                var reason = 'Domain known for "'
                             + threatTypeMap[body.matches[0].threatType] || 'Unknown'
                             + '" by Google Safe Browsing';
                return resolve({
                    safe:   false,
                    url:    url,
                    reason: reason
                });
            }

            return resolve({
                safe: true,
                url:  url
            });
        });
    });
}


module.exports = {
    isSafe: isSafeURL
}
