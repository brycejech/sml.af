'use strict';
require('../env');

const fs = require('fs');

const db = require('../lib/db');

const createLinkSequenceSQL    = fs.readFileSync(__dirname + '/sql/create-link-sequence.sql',     'utf8'),
      createLinkTableSQL       = fs.readFileSync(__dirname + '/sql/create-link-table.sql',        'utf8'),
      createRequestLogTableSQL = fs.readFileSync(__dirname + '/sql/create-request-log-table.sql', 'utf8');

const tasks = [
    {
        name: 'Create link_id Sequence',
        query: createLinkSequenceSQL
    },
    {
        name: 'Create link Table',
        query: createLinkTableSQL
    },
    {
        name: 'Create request_log Table',
        query: createRequestLogTableSQL
    }
];

const promises = [];;

tasks.forEach( async (task) => {
    promises.push(
        new Promise( async (resolve, reject) => {

            console.log(`Running "${task.name}"`);

            try{
                const result = await db.query(task.query);
                console.log(`Completed "${task.name}"`);
                resolve();
            }
            catch(e){
                console.log(`Error with "${task.name}":`);
                console.log(e);
                reject(e);
            }
        })
    )
});

Promise.all(promises)
    .then( async () => {

        await db.disconnect();
        console.log('\nDB disconnected, draining pool');

        console.log('\n----------------------');
        console.log('Installation Complete!');
        console.log('----------------------\n');

        process.exit();
    })
    .catch( async (e) => {
        console.log('\n------------------------------\n');
        console.log('Errors with install! See above');
        console.log('\n------------------------------\n')
        await db.disconnect();
        process.exit();
    });
