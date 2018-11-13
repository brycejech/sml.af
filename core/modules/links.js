'use strict';

const fs = require('fs');

const conf      = require('../../conf'),
      db        = require('../../lib/db'),
      queries   = db.queries,
      shortener = require('../../lib/shortener');

const empty = Object.create(null);

function Link(o){
    const server = conf.app.SERVER_NAME,
          hash   = o.hash;

    this.id        = o.id;
    this.hash      = hash;
    this.url       = o.url;
    this.permalink = `${ server }/${ hash }`;
    this.stats_url = `${ server }/${ hash }/stats`;
    this.peek_url  = `${ server }/${ hash }/peek`;
    this.created   = o.created;
    this.created_timestamp = o.created_timestamp;
}

async function getByUrl(url){
    const { rows } = await db.query(queries.getLinkByUrl, [url]);

    return rows.length ? new Link(rows[0]) : empty;
}


async function getByHash(hash){
    const { rows } = await db.query(queries.getLinkByHash, [hash]);

    return rows.length ? new Link(rows[0]) : empty;
}


async function getLinkOrNextID(url){
    const { rows } = await db.query(queries.getLinkOrNextID, [url]);

    return rows.length ? rows[0] : empty;
}


async function addLink(id, url, hash){

    if(!(id && url && hash)) return;

    try{
        const result = await db.query(queries.addLink, [ id, url, hash ]);

        if(result.rows){
            return new Link(result.rows[0]);
        }
    }
    catch(e){
        return e;
    }
}


async function addOrGetExisting(url){

    const exists = await getLinkOrNextID(url);

    if(exists.url) return exists;

    const id   = exists.next_id,
          hash = shortener.encode(id);

    try{
        return await addLink(id, url, hash);
    }
    catch(e){
        return e;
    }
}

async function getAll(){
    const links = await db.query(queries.getAllLinks, []);

    return links.rows.map((link) => new Link(link));
}


module.exports = {
    getByUrl,
    getByHash,
    getLinkOrNextID,
    addLink,
    addOrGetExisting,
    getAll
}
