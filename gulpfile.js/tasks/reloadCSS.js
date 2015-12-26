var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('reloadCSS', function() {
    return gulp.src('./public/style.css').pipe(livereload());
});
