var gulp        = require('gulp');
var config      = require('../config');
var livereload  = require('gulp-livereload');

gulp.task('watch', ['watchify'], function () {

  'use strict';

  livereload.listen();
  gulp.watch(config.less.watch, ['css']);
});