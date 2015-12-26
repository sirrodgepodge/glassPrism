var gulp = require('gulp'),
    runSeq = require('run-sequence');

gulp.task('build', function() {
    if (process.env.NODE_ENV === 'production') {
        runSeq(['webpack', 'buildJSProduction', 'buildCSSProduction']);
    } else {
        runSeq(['webpack', 'buildJS', 'buildCSS']);
    }
});
