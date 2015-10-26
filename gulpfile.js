'use strict';

// All used modules.
var babel = require('gulp-babel');
var gulp = require('gulp');
var runSeq = require('run-sequence');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var globbing = require('gulp-css-globbing');

// Development tasks
// --------------------------------------------------------------

// Live reload business.
gulp.task('reload', function () {
    livereload.reload();
});

gulp.task('reloadCSS', function () {
    return gulp.src('./public/style.css').pipe(livereload());
});

gulp.task('lintJS', function () {

    return gulp.src(['./browser/**/*.js', './server/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());

});

gulp.task('buildJS', ['lintJS'], function () {
    return gulp.src(['./browser/app.js', './browser/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public'));
});

gulp.task('buildCSS', function () {
    return gulp.src('./browser/universal.scss')
        .pipe(globbing({
            // Configure it to use SCSS files
            extensions: ['.scss']
        }))
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./public'));
});


// --------------------------------------------------------------

// Production tasks
// --------------------------------------------------------------

gulp.task('buildCSSProduction', function () {
  return gulp.src('./browser/universal.scss')
      .pipe(globbing({
          // Configure it to use SCSS files
          extensions: ['.scss']
      }))
      .pipe(sass({
          errLogToConsole: true
      }))
      .pipe(rename('style.css'))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./public'));
});

gulp.task('buildJSProduction', function () {
    return gulp.src('./browser/**/*.js')
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

gulp.task('buildProduction', ['buildCSSProduction', 'buildJSProduction']);

// --------------------------------------------------------------

// Composed tasks
// --------------------------------------------------------------

gulp.task('build', function () {
    if (process.env.NODE_ENV === 'production') {
        //runSeq(['buildJS', 'buildCSS']);
        runSeq(['buildJSProduction', 'buildCSSProduction']);
    } else {
        runSeq(['buildJS', 'buildCSS']);
    }
});

gulp.task('default', function () {

    livereload.listen();
    gulp.start('build');

    gulp.watch(['browser/**/*.js', 'browser/**/*.html'], function () {
        runSeq('buildJS', 'reload');
    });

    gulp.watch('./browser/**/*.scss', function () {
        runSeq('buildCSS', 'reloadCSS');
    });

    gulp.watch('server/**/*.js', ['lintJS']);

    // Reload when a template (.html) file changes.
    gulp.watch(['server/app/views/*.html'], ['reload']);

});
