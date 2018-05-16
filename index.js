'use strict';

const express      = require('express'),
      exphbs       = require('express-handlebars'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      cookie       = require('cookie'),
      path         = require('path'),
      { Pool }     = require('pg');

const env = process.env;

const server = express();

server.set('case sensitive routing', true);
server.use(cookieParser(), bodyParser.json());


// Static routing
// Move static routes to web server for better performance
server.use(express.static(path.join(__dirname, 'static')));

// HANDLEBARS SETUP
let hbs = exphbs.create({
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    defaultLayout: 'main',
    extname: 'handlebars' // Set the file extension type for looking up views
});
server.engine('handlebars', hbs.engine);
server.set('view engine', 'handlebars');


/*
    =======
    ROUTING
    =======
*/
const routes = require('./routes');

server.get('/', getRequestInfo, routes.root);
server.get('/:link', routes.link);
server.get('/:link/stats', routes.linkStats);
server.get('/o/:org/:link', routes.orgLink);

function getRequestInfo(req, res, next){
    console.log(req.headers);
    return next();
}


// APP START
const PORT = env.PORT || 8080;

server.listen(PORT, () => { console.log(`Server listening on ${PORT}`)});
