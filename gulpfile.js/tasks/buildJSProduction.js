var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    handleErrors = require('../lib/handleErrors');

gulp.task('buildJSProduction', function(){
    return gulp.src(['./browser/app.js', './browser/**/*.js'])
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(gulp.dest('./public'));
});
