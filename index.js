'use strict';

const express      = require('express'),
      exphbs       = require('express-handlebars'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      // cookie       = require('cookie'),
      path         = require('path');

const logRedirect = require('./lib/log-redirect');

const env = process.env;

const server = express();

server.set('case sensitive routing', true);
server.enable('trust proxy');
server.use(cookieParser(), bodyParser.json(), bodyParser.urlencoded({extended: true}));


// Static routing
// Move static routes to web server for better performance
server.use(express.static(path.join(__dirname, 'client')));

// HANDLEBARS SETUP
let hbs = exphbs.create({
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    defaultLayout: 'main',
    extname: 'handlebars' // Set the file extension type for looking up views
});
server.engine('handlebars', hbs.engine);
server.set('view engine', 'handlebars');

/*
    ===========
    TEST ROUTES
    ===========
*/
server.get('/testRedirect', (req, res, next) => {

    const time = Date.now();

    while(Date.now() - time < 10000){
        let a = 0;
    }
    return res.redirect('https://google.com');
});
/*
    =======
    ROUTING
    =======
*/
const routes = require('./routes');

server.get('/', routes.root);
server.get('/logs/', routes.getRequestLog);
server.get('/links/', routes.allLinks);
server.get('/:link', routes.link, logRedirect);
server.get('/:link/stats', routes.linkStats);
server.get('/:link/peek', routes.peek);

server.post('/api/link', routes.addLink);


// APP START
const PORT = env.PORT || 8080;

server.listen(PORT, () => { console.log(`Server listening on ${PORT}`)});
