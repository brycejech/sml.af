'use strict';

const fs = require('fs');

const conf      = require('../../conf'),
      db        = require('../../lib/db'),
      queries   = db.queries,
      shortener = require('../../lib/shortener');

const empty = Object.create(null);

async function getByUrl(url){
    const { rows } = await db.query(queries.getLinkByUrl, [url]);

    return rows.length ? rows[0] : empty;
}


async function getByHash(hash){
    const { rows } = await db.query(queries.getLinkByHash, [hash]);

    return rows.length ? rows[0] : empty;
}


async function getLinkOrNextID(url){
    const { rows } = await db.query(queries.getLinkOrNextID, [url]);

    return rows.length ? rows[0] : empty;
}


async function addLink(id, url, short_url, permalink){

    if(!(id && url && short_url && permalink)) return;

    try{
        const result = await db.query(queries.addLink, [ id, url, short_url, permalink ]);

        if(result.rows){
            return result.rows[0];
        }
    }
    catch(e){
        return e;
    }

}


async function addOrGetExisting(url){

    const exists = await getLinkOrNextID(url);

    if(exists.url) return exists;

    const id        = exists.next_id,
          short_url = shortener.encode(id),
          permalink = `${conf.app.SERVER_NAME}/${short_url}`;

    try{
        return await addLink(id, url, short_url, permalink);
    }
    catch(e){
        return e;
    }
}

async function getAll(){
    const links = await db.query(queries.getAllLinks, []);
    return links.rows;
}


module.exports = {
    getByUrl,
    getByHash,
    getLinkOrNextID,
    addLink,
    addOrGetExisting,
    getAll
}
