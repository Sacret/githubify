var gulp         = require('gulp');
var size         = require('gulp-filesize');

var config       = require('../config').fonts;

gulp.task('fonts', function () {

  'use strict';

  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});