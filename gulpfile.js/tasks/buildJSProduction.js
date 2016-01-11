var gulp = require('gulp'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    handleErrors = require('../lib/handleErrors');

gulp.task('buildJSProduction', function(){
    return gulp.src('./browser/**/*.js')
        .pipe(concat('main.js'))
        .pipe(babel({
    			presets: ['es2015']
    		}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(gulp.dest('./public'));
});
