'use strict';

const db = require('../lib/db');


/*
    Create Link table
*/

(async () => {

const createLinkTableSQL = `

    DROP TABLE IF EXISTS link CASCADE;

    CREATE TABLE link
    (
        id       SERIAL PRIMARY KEY,
        link     TEXT UNIQUE NOT NULL,
        url      TEXT NOT NULL,
        created  TIMESTAMP DEFAULT now()::timestamp
    );
`;

try{
    const result = await db.query(createLinkTableSQL);
}
catch(e){
    console.log('Failed to create "link" table:');
    console.log(e);
}

})();
