// jshint node: true
'use strict';

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
// var babel = require('gulp-babel');
var babelify = require('babelify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
// var reactify = require('reactify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var config = require('../config').browserify;
var locations = require('../config').locations;

gulp.task('browserify', [], function() {
  return browserifyTask({ watch: false, debug: true });
});

gulp.task('watchify', [], function() {
  return browserifyTask({ watch: true, debug: true });
});

gulp.task('uglify', [], function() {
  function uglifyTapIn(stream) {
    return stream.pipe(uglify());
  }
  return browserifyTask({ watch: false, uglify: true });
});

// Browserify client-side scripts.
function browserifyTask(params) {
  if (params == null) params = {};
  if (params.watch == null) params.watch = false;
  if (params.debug == null) params.debug = false;
  if (params.uglify == null) params.uglify = false;

  var b = browserify({
    extensions: ['.js'],
    debug: true //params.debug
  });

  // b.transform(reactify);
  b.transform('babelify', {
    presets: ['es2015', 'react']
  });

  config.files.map(function(file) {
    b.add(file);
  });

  b.on('log', gutil.log);

  function bundle() {
    var stream = b.bundle()
      .pipe(source(config.name))
      .pipe(buffer());
    if (params.debug === true) {
      stream = stream.pipe(plumber(errorHandler))
    }
    // stream = stream.pipe(babel({
    //   presets: ['es2015', 'react']
    // }));
    if (params.uglify === true) {
      stream = stream.pipe(uglify())
    }
    return stream
      .pipe(gulp.dest(config.dest));
  }

  if (params.watch) {
    b = watchify(b);
    b.on('update', function() {
      gutil.log('Watchify detected a change');
      bundle();
    });
  }

  return bundle();
}

function errorHandler (err) {
  gutil.log(err.toString());
  this.emit('end');
}
