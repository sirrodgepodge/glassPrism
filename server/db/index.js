const chalk = require('chalk'),
	Promise = require('bluebird'),
	mongoose = require('mongoose'),
	path = require('path');

const env = require(path.join(__dirname,
	'../env/' + (process.env.NODE_ENV === 'production'? 'production' : 'development')));

const db = mongoose.connect(env.DATABASE_URI).connection;

/**
 * Will envoke Schemas so that they can be accessed by other files
 * As mongoose.model
 **/
require('./models');

const startDb = new Promise((resolve, reject) => {
    db.on('connected', resolve);
    db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to mongodb'));

startDb.then(() => console.log(chalk.green('Connection to mongodb successful!')));

module.exports = startDb;
