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
    return res.render('home');
}

async function link(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });


    // if peek cookie present, use it, otherwise set to true
    const peekEnabled = Object.hasOwnProperty.call(req.cookies, 'peek')
            ? parseInt(req.cookies.peek)
            : true;

    if(peekEnabled){
        res.header('Set-Cookie', getPeekCookie(peekEnabled));
        return res.redirect([
            conf.app.SERVER_NAME,
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

    let peekEnabled = res.locals.peekEnabled;

    // if user wants to set peek val, override and set cookie
    if(req.query.hasOwnProperty('setPeek')){
        peekEnabled = parseInt(req.query.setPeek) ? true : false;
        res.header('Set-Cookie', getPeekCookie(peekEnabled));
    }

    try{
        const link = await core.links.getByHash(req.params.link);

        return res.render('peek', { link, peekEnabled });
    }
    catch(e){
        return res.status(500).send({ message: 'Server error' });
    }
}

async function allLinks(req, res, next){
    try{
        const results = await core.links.getAll();

        return res.send(results);
    }
    catch(e){
        return res.status(500).send({ message: e});
    }

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

            added.new = true;
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

    let linkData;

    try{
        linkData = await core.links.getByHash(req.params.link);
    }
    catch(e){
        return res.status(404).send({ message: 'Link not found' });
    }

    try{
        const logData = await core.logs.url(req.params.link);

        return res.render('requestLog', { log: logData, link: linkData, layout: 'bare' });
    }
    catch(e){
        return res.status(500).send({ message: 'Server error' });
    }
    return res.send({ message: `Getting stats for ${req.params.link}` });
}

function getPeekCookie(on){
    return cookie.serialize('peek', on ? 1 : 0, {
        path: '/',
        httpOnly: true,
        expires: new Date('12/31/9999')
    });
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
