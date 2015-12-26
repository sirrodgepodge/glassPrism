var path = require('path');

var config = {};

config.root = path.join(__dirname, '../../');

config.destDirectory = "./public";
config.sourceDirectory = "./browser";
config.vendorBundleDir = "./server/app/views";

module.exports = config;
