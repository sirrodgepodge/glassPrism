var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    runSeq = require('run-sequence');

gulp.task('default', function() {

    livereload.listen();
    gulp.start('build');

    gulp.watch(['browser/**/*.js', 'browser/**/*.html'], function() {
        runSeq('buildJS','webpack', 'reload');
    });

    gulp.watch('browser/**/*.scss', function() {
        runSeq('buildCSS', 'reloadCSS');
    });

    gulp.watch('server/**/*.js', ['lintJS']);

    // Reload when a template (.html) file changes.
    gulp.watch(['server/app/views/*.html'], ['reload']);
});
