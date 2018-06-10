'use strict';

const conf = require('../../../conf');

const request = require('request');

const threatTypeMap = {
    MALWARE: 'Malware',
    SOCIAL_ENGINEERING: 'Social Engineering',
    UNWANTED_SOFTWARE:  'Unwanted Software',
    POTENTIALLY_HARMFUL_APPLICATION: 'Potentially Harmful Application'
}

/*
    Uses the Google Safe Browsing API to
    check the URL against known bad domains
*/
async function checkGoogleSafeBrowsing(url){

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
                const threatType = body.matches[0].threatType || 'Unknown';
                return resolve({
                    safe:   false,
                    url:    url,
                    reason: `Domain known for "${threatType}" by Google Safe Browsing`
                });
            }

            return resolve({
                safe: true,
                url:  url
            });
        });
    });

}

module.exports = checkGoogleSafeBrowsing;
