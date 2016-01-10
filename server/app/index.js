// create app, configurations and api routes
var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    swig = require('swig'),
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
// Set view render engine
app.engine('html', swig.renderFile);
app.setValue('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Set favicon
app.use(favicon(app.getValue('faviconPath')));

// Allowing 'index.html' to access files in the following folders
var root = app.getValue('root');
app.use(express.static(path.join(root, './node_modules')));
app.use(express.static(path.join(root, './public')));
app.use(express.static(path.join(root, './browser')));

// Views cache
app.setValue('view cache', true);

// Set cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Configure auth
require('./configRoutes')(app);

// All data routes will be prefaced with /api
app.use('/api', require('./appRoutes'));

// All get routes that go through the pipeline, past /api, will get the single page layout
app.get('/*', (req, res) => {
    res.render('index');
});

module.exports = app;
