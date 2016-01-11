var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    handleErrors = require('../lib/handleErrors');


gulp.task('buildJS', ['lintJS'], function() {
    return gulp.src(['./browser/app.js', './browser/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .on('error', handleErrors)
        .pipe(gulp.dest('./public'));
});
