// create app, configurations and api routes
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    path = require('path'),
    favicon = require('serve-favicon');

var app = express();

// setValue and getValue are merely alias
// for app.set and app.get used in the less
// common way of setting application variables.  // Taken from FSG
app.setValue = app.set.bind(app);
app.getValue = function(mypath) {
    return app.get(mypath);
};

// Get environmental variables
require('../env')(app);


// Set middlewares
//// Show activity in console
app.use(logger('dev'));
//// Parse cookies
app.use(cookieParser());
//// Parse our POST and PUT bodies.
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view render engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set favicon
app.use(favicon(app.getValue('faviconPath')));

// Allowing 'index.html' to access files in the following folders
var root = app.getValue('root');
app.use(express.static(path.join(root, './node_modules')));
app.use(express.static(path.join(root, './public')));
app.use(express.static(path.join(root, './browser')));

// Views cache
app.setValue('view cache', false);

// Set cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configRoutes')(app);

// All data routes will be prefaced with /api
app.use('/api', require('./internalRoutes'));

// All get routes that go through the pipeline, past /api, will get the single page layout
app.get('/*', function(req, res) {
    res.render('layout', {title:'For Adriaan'});
});

module.exports = app;
