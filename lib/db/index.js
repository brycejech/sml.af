'use strict';

const conf = require('../../conf').pg;

const queries = require('./sql/queries');

const { Pool } = require('pg'),
        pool   = new Pool(conf);

function _getClient(){ return pool.connect() }

// Base query wrapper
// Checks out clients from the pool,
// executes queries, and returns a promise
async function query(q, vals){
    const client = await _getClient();

    return new Promise(async (resolve, reject) => {
        try{
            const res = await client.query(q, vals);
            resolve(res);
        }
        catch(e){
            reject(e);
        }
        finally{
            client.release();
        }
    });
}

async function disconnect(){
    return pool.end();
}

module.exports = {
    query,
    queries,
    disconnect
}

// Close postgres pool on shutdown
function _exitHandler(){

    console.log('\nProcess terminating');

    pool.end()
        .then(() => {
            console.log('Clients disconnected, draining pool');
        })
        .catch((err) => {
            console.log(err);
        })
}

process.on('SIGINT', _exitHandler);
