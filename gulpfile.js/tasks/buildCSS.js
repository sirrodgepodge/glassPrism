var gulp = require('gulp'),
    globbing = require('gulp-css-globbing'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    config = require('../config/sass'),
    handleErrors = require('../lib/handleErrors');


gulp.task('buildCSS', function() {
    return gulp.src('./browser/universal.scss')
        .pipe(sourcemaps.init())
        .pipe(globbing({
            // Configure it to use SCSS files
            extensions: ['.scss']
        }))
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./public'));
});
