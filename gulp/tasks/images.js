var gulp         = require('gulp');
var changed      = require('gulp-changed');

var handleErrors = require('../utils/handleErrors');
var config      = require('../config').images;

gulp.task('images', function () {

  'use strict';

  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest));
});
