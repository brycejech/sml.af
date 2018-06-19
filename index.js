'use strict';

const express      = require('express'),
      RateLimit    = require('express-rate-limit'),
      exphbs       = require('express-handlebars'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      cookie       = require('cookie'),
      path         = require('path');

const logRedirect = require('./lib/log-redirect');

const env = process.env;

const limiter = new RateLimit({
    windowMS: 1 * 60 * 1000, // 1 minute
    max: 10,
    delayMs: 0,
    handler: (req, res) => res.status(429).send({ message: 'Rate limit exceeded, try again later :(' })
})

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
    =======
    ROUTING
    =======
*/
const routes = require('./routes');

server.get('/', routes.root);
server.get('/logs/', routes.getRequestLog);
server.get('/links/', routes.allLinks);
server.get('/:link', limiter, isPeekEnabled, routes.link, logRedirect);
server.get('/:link/stats', routes.linkStats);
server.get('/:link/peek', isPeekEnabled, routes.peek);

server.post('/api/link', limiter, routes.addLink);

function isPeekEnabled(req, res, next){
    const cookies = req.cookies,
          enabled = Object.hasOwnProperty.call(cookies, 'peek') && Boolean(parseInt(req.cookies.peek));
    res.locals.peekEnabled = enabled;
    return next();
}


// APP START
const PORT = env.PORT || 8080;

server.listen(PORT, () => { console.log(`Server listening on ${PORT}`)});
