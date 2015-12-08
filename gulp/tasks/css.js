var gulp        = require('gulp');
var concat      = require('gulp-concat');
var cssmin      = require('gulp-cssmin');
var sourcemaps  = require('gulp-sourcemaps');
var livereload  = require('gulp-livereload');

var handleErrors = require('../utils/handleErrors');
var config       = require('../config').css;

// Combines all css together, after less
gulp.task('css', ['less'], function () {

  'use strict';

  return gulp.src(config.files)
    .pipe(sourcemaps.init())
    .pipe(concat(config.name))
    .pipe(cssmin())
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest))
    .pipe(livereload({basePath: 'build/'}));
});