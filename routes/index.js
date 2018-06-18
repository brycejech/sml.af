'use strict';
/*
    TODO
    - Clean up naming issues with the word link
*/
const cookie = require('cookie'),
      core   = require('../core/smlaf'),
      conf   = require('../conf');

const validUrl = require('valid-url');

function root(req, res, next){
    // return res.send(req.headers);
    return res.render('home');
}

async function link(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });

    let peek = req.cookies.hasOwnProperty('peek')
        ? parseInt(req.cookies.peek)
        : true;

    if(peek){
        const peekCookie = cookie.serialize('peek', 1, {
            httpOnly: true,
            expires: new Date('12/31/9999')
        });
        res.header('Set-Cookie', peekCookie);
        return res.redirect([
            // conf.app.SERVER_NAME,
            'http://localhost:8080',
            req.params.link,
            'peek'
        ].join('/'));
    }

    const link = res.locals.link = await core.links.getByHash(req.params.link) || {}

    res.send(link);

    return next();
}

async function peek(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });

    try{
        const link = await core.links.getByHash(req.params.link);

        if(!link.url){
            return res.send({ message: 'This is not a sml.af link' });
        }
        else{
            return res.send({
                short_url:  link.short_url,
                permalink:  link.permalink,
                created:    link.created,
                redirectTo: link.url
            });
        }
    }
    catch(e){
        return res.status(500).send({ message: 'Server error' });
    }
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
        if(exists.url) return res.send(exists);

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

async function linkStats(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });

    try{
        const data = await core.logs.url(req.params.link);
        console.log(data);
        return res.render('requestLog', { log: data, layout: 'bare' });
    }
    catch(e){
        return res.status(500).send({ message: 'Server error' });
    }
    return res.send({ message: `Getting stats for ${req.params.link}` });
}

module.exports = {
    root,
    link,
    peek,
    linkStats,
    allLinks,
    addLink,
    getRequestLog
}
