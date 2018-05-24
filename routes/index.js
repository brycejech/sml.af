'use strict';

const core = require('../core/smlaf.js');

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
    const url = req.body.link;
    
    if(!url){
        const message = 'Must provide link -> https://sml.af/api/link/:link';
        return res.status(400).send({ message });
    }

    const link = url;

    const added = await core.links.addOrGetExisting(link);

    return res.send(added);
}

function linkStats(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });

    return res.send({ message: `Getting stats for ${req.params.link}` });
}

function orgLink(req, res, next){
    if(!(req.params.org && req.params.link)) return res.status(404).send({ message: 'Not Found' });

    return res.send({
        org: req.params.org,
        link: req.params.link
    });
}

module.exports = {
    root,
    link,
    linkStats,
    allLinks,
    addLink,
    orgLink
}
