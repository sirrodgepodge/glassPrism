var config = require('./');
var refills = require('node-refills').includePaths;

module.exports = {
  autoprefixer: { browsers: ['last 2 version'] }, // https://github.com/ai/browserslist#queries
  src: [config.coreSourceAssets + "/stylesheets/**/*.{sass,scss}", config.sourceAssets + "/stylesheets/**/*.{sass,scss}"],
  dest: config.publicAssets + '/stylesheets',
  settings: {
    indentedSyntax: false, // Toggle .sass syntax
    imagePath: 'browser/images', // Used by the image-url helper
    includePaths: refills
  }
};
