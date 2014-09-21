var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var source = require('vinyl-source-stream');
var browserify = require('browserify');

gulp.task('lint', function() {
  return gulp.src('./client/scripts/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function() {
  return browserify('./client/scripts/entry.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe($.streamify( $.uglify() ))
    .pipe(gulp.dest('public'))
});

gulp.task('sass', function () {
  return gulp.src('./client/stylesheets/main.sass')
    .pipe($.rubySass())
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe(gulp.dest('public'))
});

gulp.task('watch', function() {
  gulp.watch('./scripts/*.js', ['lint', 'scripts']);
  gulp.watch('./stylesheets/*.sass', ['sass']);
});

gulp.task( 'default', [ 'lint', 'scripts', 'sass', 'watch' ] );
