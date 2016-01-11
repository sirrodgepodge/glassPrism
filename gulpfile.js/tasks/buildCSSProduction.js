var gulp = require('gulp'),
    globbing = require('gulp-css-globbing'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    config = require('../config/sass'),
    handleErrors = require('../lib/handleErrors'),
    _ = require('lodash');

gulp.task('buildCSSProduction', function() {
  return gulp.src('./browser/app.scss')
      .pipe(globbing({
          // Configure it to use SCSS files
          extensions: ['.scss']
      }))
      .pipe(sass(_.merge({
          outputStyle: 'compressed'
      }, config.settings)))
      .pipe(rename('style.css'))
      .on('error', handleErrors)
      .pipe(gulp.dest('./public'));
});
