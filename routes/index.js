'use strict';

const core = require('../core/smlaf');

const validUrl = require('valid-url');

function root(req, res, next){
    // return res.send(req.headers);
    return res.render('home');
}

async function link(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });

    const requestLink = req.params.link;

    const link = await core.links.getByHash(requestLink);

    res.send(link || {});

    res.locals.link = link || {};
    return next();
}

async function allLinks(req, res, next){
    const results = await core.links.getAll();

    return res.send(results);
}

async function addLink(req, res, next){

    // TODO
    // - validate url with valid-url

    const url = req.body.link;

    if(!url){
        const message = 'Must provide link -> https://sml.af/api/link/:link';
        return res.status(400).send({ message });
    }

    try{
        // TODO
        // - update how existence is checked
        // - hitting db way too many times for this route
        // - currently checks if exists, then to addOrGetExisting which hits db twice
        const exists = await core.links.getByUrl(url);
        if(exists) res.send(exists);

        const isSafe = await core.url.isSafe(url);

        if(isSafe.safe){
            const added = await core.links.addOrGetExisting(url);

            added.created = true;
            added.message = 'Success';

            return res.send(added);
        }
        else{
            return res.send({
                created: false,
                message: 'Failed to create short URL. ' + isSafe.reason,
                url:     isSafe.url
            });
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send({ message: 'Server Error' });
    }
}

async function getRequestLog(req, res, next){
    const data = await core.logs.getAll();

    return res.render('requestLog', { log: data, layout: 'bare' });
}

function linkStats(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });

    return res.send({ message: `Getting stats for ${req.params.link}` });
}

module.exports = {
    root,
    link,
    linkStats,
    allLinks,
    addLink,
    getRequestLog
}
