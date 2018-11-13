'use strict';

const conf      = require('../../conf'),
      db        = require('../../lib/db'),
      queries   = db.queries;


async function getAll(){
    try{
        const data = await db.query(queries.getAllRequests, []);

        if(data.rows){
            return data.rows;
        }
    }
    catch(e){
        return undefined
    }
}

async function byHash(hash){
    try{
        const data = await db.query(queries.getLinkLog, [hash]);

        if(data.rows){
            return data.rows;
        }
    }
    catch(e){
        return undefined;
    }
}

module.exports = {
    getAll: getAll,
    url: byHash
};
