'use strict';

require('./env');

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

    const promises = [];

    for(let i = 0, len = urls.length; i < len; i++){
        const url = urls[i];

        try{
            promises.push(core.links.addOrGetExisting(url));
        }
        catch(e){
            console.log('Error:');
            console.log(e);
            console.log('----------');
        }
    }

    Promise.all(promises).then(links => {
        links.forEach(link => console.log(link));
    })
    .then(() => process.exit());

})();
