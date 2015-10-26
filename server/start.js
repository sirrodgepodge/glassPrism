'use strict';

var chalk = require('chalk');

var startDb = require('./db');
var app = require('./app');

var server = require('http').createServer();

var createApplication = function() {
  server.on('request', app);
};

var startServer = function () {
    // Allow user to specify port number from console
    var PORT = process.argv[2] && !isNaN(Number(process.argv[2]))? Number(process.argv[2]) : process.env.PORT || 1337;
    server.listen(PORT, function () {
        console.log(chalk.green('Server started on port', chalk.blue(PORT)));
    });
};

startDb.then(createApplication)
.then(startServer)
.catch(function(err){
  console.error(chalk.red(err.stack));
  process.kill(1);
});
