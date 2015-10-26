var chalk = require('chalk');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var path = require('path');

var env = require(path.join(__dirname,
	'../env/' + (process.env.NODE_ENV === 'production'? 'production' : 'development')));

var DATABASE_URI = env.DATABASE_URI;

var db = mongoose.connect(DATABASE_URI).connection;

/**
 * Will envoke Schemas so that they can be accessed by other files
 * As mongoose.model
 **/
require('./models');

var startDb = new Promise(function(resolve, reject) {
    db.on('connected', resolve);
    db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to mongodb'));

startDb.then(function() {
    console.log(chalk.green('Connection to mongodb successful!'));
});

module.exports = startDb;
