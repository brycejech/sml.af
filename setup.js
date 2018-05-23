'use strict';

const core = require('./core/smlaf');

const urls = [
    'https://google.com',
    'https://duckduckgo.com',
    'https://yahoo.com',
    'https://bing.com',
    'https://mozilla.org',
    'https://reddit.com',
    'https://github.com'
];

( async () => {

    for(let i = 0, len = urls.length; i < len; i++){
        const url = urls[i];

        const link = await core.links.addOrGetExisting(url);
        console.log(link);
    }

})();
