'use strict';

const { URL } = require('url');

const hasRedirectOrTimeout    = require('./has-redirect-or-timeout'),
      redirectInQueryString   = require('./redirect-in-querystring'),
      checkGoogleSafeBrowsing = require('./check-google-safe-browsing');

async function isSafeURL(url){

    if(redirectInQueryString(url)){
        return {
            safe:   false,
            reason: 'URL has potential redirect in querystring.',
            url:    url
        }
    }

    const redirectOrTimeout = await hasRedirectOrTimeout(url);
    console.log(redirectOrTimeout);
    if(redirectOrTimeout){
        return {
            safe:   false,
            reason: 'Url is a redirect or took too long to respond.',
            url:    url
        }
    }

    const safeBrowsing = await checkGoogleSafeBrowsing(url);

    return safeBrowsing;
}


module.exports = {
    isSafe: isSafeURL
}
