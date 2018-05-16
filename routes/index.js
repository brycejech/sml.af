'use strict';

function root(req, res, next){
    return res.render('home');
}

function link(req, res, next){
    if(!req.params.link) return res.status(404).send({ message: 'Not Found' });

    return res.send({ link: req.params.link });
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
    orgLink
}
