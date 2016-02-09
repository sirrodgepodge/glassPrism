var path = require('path'),
    aws = require('aws-sdk'),
    devConfigPath = path.join(__dirname, './development.js'),
    productionConfigPath = path.join(__dirname, './production.js');

module.exports = function(app) {
    if (process.env.NODE_ENV === 'production') {
        app.setValue('env', require(productionConfigPath));
    } else {
        app.setValue('env', require(devConfigPath));
    }

    // Set root directory path
    app.setValue('root', path.resolve('./'));

    // Set favicon path
    app.setValue('faviconPath', path.join(app.getValue('root'), './server/app/views/favicon.ico'));

    // Creates AWS credentials
    aws.config.update({
        accessKeyId: app.getValue('env').AWS.clientID,
        secretAccessKey: app.getValue('env').AWS.clientSecret
    });
};
