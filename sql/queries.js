'use strict';

const fs = require('fs');

const dir = __dirname

const getLinkByUrl    = fs.readFileSync(dir + '/queries/get-link-by-url.sql',     'utf8'),
      getLinkByHash   = fs.readFileSync(dir + '/queries/get-link-by-hash.sql',    'utf8'),
      linkExists      = fs.readFileSync(dir + '/queries/link-exists.sql',         'utf8'),
      getLinkOrNextID = fs.readFileSync(dir + '/queries/get-link-or-next-id.sql', 'utf8'),
      addLink         = fs.readFileSync(dir + '/queries/add-link.sql',            'utf8'),
      getAllLinks     = fs.readFileSync(dir + '/queries/get-all-links.sql',       'utf8'),

      logRequest      = fs.readFileSync(dir + '/queries/log-request.sql',         'utf8'),
      getAllRequests  = fs.readFileSync(dir + '/queries/get-all-requests.sql',    'utf8');


const queries = {
    getLinkByHash,
    getLinkByUrl,
    linkExists,
    getLinkOrNextID,
    addLink,
    getAllLinks,

    logRequest,
    getAllRequests
}

module.exports = queries;
