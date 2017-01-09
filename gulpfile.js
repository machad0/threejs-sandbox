const gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect');

gulp.task('webserver', () => {
    connect.server({
        livereload: true
    });
});

gulp.watch([
    'js/controls/*.js',
    'lib/*.js'
]);

gulp.task('default', [
    'webserver'
]);
