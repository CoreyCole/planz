var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('connect', function() {
    connect.server({
        port: 9000,
        root: 'dist',
        livereload: true
    });
});

gulp.task('sass', function() {
    gulp.src('app/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch('app/styles/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js', ['dev-copy']);
    gulp.watch('app/**/*.html', ['dev-copy']);
    gulp.watch('app/**/*.css', ['dev-copy']);
});

gulp.task('copy', function() {
    gulp.src('app/img/**')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('dev-copy', function() {
    gulp.src('app/js/**')
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
    gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
    gulp.src('app/**/*.css')
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('default', ['sass', 'watch', 'copy', 'dev-copy', 'connect']);