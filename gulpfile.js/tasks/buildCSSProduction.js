var gulp = require('gulp'),
    globbing = require('gulp-css-globbing'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    config = require('../config/sass'),
    _ = require('lodash');

gulp.task('buildCSSProduction', function() {
  return gulp.src('./browser/universal.scss')
      .pipe(globbing({
          // Configure it to use SCSS files
          extensions: ['.scss']
      }))
      .pipe(sass(_.merge({
          outputStyle: 'compressed'
      }, config.settings)))
      .pipe(rename('style.css'))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./public'));
});
