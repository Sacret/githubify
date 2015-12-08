var gulp                 = require('gulp');
var less                 = require('gulp-less');
var size                 = require('gulp-filesize');

var handleErrors         = require('../utils/handleErrors');
var config               = require('../config').less;

//var LessPluginCleanCSS   = require("less-plugin-clean-css"),
//    cleancss             = new LessPluginCleanCSS({advanced: true});

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix           = new LessPluginAutoPrefix({browsers: ['last 2 versions']});

// combines all less together
gulp.task('less', function () {

  'use strict';

  return gulp.src(config.src)
    .pipe(less({
      //plugins: [autoprefix, cleancss]
      plugins: [autoprefix]
    }))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest))
    .pipe(size());
});