var config = require('../config/'),
    webpackConfig = require('../config/webpack'),
    gulp = require('gulp'),
    logger = require('../lib/compileLogger'),
    webpack = require('webpack');

gulp.task('webpack', function(cb) {

  return webpack(webpackConfig,
    function(err, stats) {
      //log stuff to console
      logger(err, stats);
      cb();
  });

});
