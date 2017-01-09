const gulp = require('gulp'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      rename = require('gulp-rename'),
      connect = require('gulp-connect');

gulp.task('webserver', () => {
    connect.server({
        livereload: true
    });
})
gulp.task('babel', () => {
    return gulp.src([
	'js/controls/*.js',
	'js/*.js'
    ])
	.pipe(babel({
            presets: ['es2015']
	}))
	.pipe(gulp.dest('dist'))
	.pipe(gulp.dest('dist'))
	.pipe(rename('build.js'))
	.pipe(gulp.dest('dist'))
});

gulp.watch([
    'js/controls/*.js',
    'js/*.js'
], ['babel']);

gulp.task('default', [
    'babel',
    'webserver'
]);
