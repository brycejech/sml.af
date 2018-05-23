'use strict';

const fs = require('fs');

const db        = require('../../lib/db'),
      shortener = require('../../lib/shortener');

const queries = require('../../sql/queries');


async function getByUrl(url){
    const result = await db.query(queries.getLinkByUrl, [url]);

    return result.rows;
}


async function getByHash(hash){
    const result = await db.query(queries.getLinkByHash, [hash]);

    return result.rows;
}


async function linkExists(url){
    const result = await db.query(queries.linkExists, [url]);
}


async function getLinkOrNextID(url){
    const result = await db.query(queries.getLinkOrNextID, [url]);
    if(result.rows){
        return result.rows[0];
    }
}


async function addLink(id, url, short_url){

    if(!(id && url && short_url)) return;

    try{
        const result = await db.query(queries.addLink, [ id, url, short_url ]);

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
          short_url = shortener.encode(id);

    try{
        return await addLink(id, url, short_url);
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
    linkExists,
    getLinkOrNextID,
    addLink,
    addOrGetExisting,
    getAll
}
