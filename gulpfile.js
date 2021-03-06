var
  src = './dev/',
  dest = './build/',
  gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  cssmin = require('gulp-cssmin');

// server
gulp.task('webserver', function () {
  gulp.src(dest)
    .pipe(webserver({}));
});

// compile sass
gulp.task('sass', function () {
  gulp.src(src + 'sass/**/*.sass')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest(dest + 'css/'));
});

// compless js
gulp.task('concat', function () {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js', src + 'js/**/*.js'])
    .pipe(plumber())
    .pipe(gulp.dest(dest + 'js/'));
});

// html
gulp.task('html', function () {
  return gulp.src(src + 'html/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest(dest));
});

// img
gulp.task('images', function () {
  return gulp.src(src + 'img/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(dest + 'img/'));
});

// watchタスク(**/*.sass変更時に実行するタスク)
gulp.task('watch', function () {
  gulp.watch(src + 'sass/**/*.sass', ['sass']);
  gulp.watch(src + 'js/**/*.js', ['concat']);
  gulp.watch(src + 'html/**/*.html', ['html']);
  gulp.watch(src + 'img/**/*', ['images']);
});

gulp.task('default', ['sass', 'concat', 'html', 'images', 'webserver', 'watch']);
