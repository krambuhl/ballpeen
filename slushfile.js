var pkg = require('./package.json');
var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var rename = require('gulp-rename')
var inquirer = require('inquirer');
var licenses = require('osi-licenses');


gulp.task('copy-template', function(done) {
  return gulp.src(__dirname + '/template/**', { dot: true }) 
    .pipe(conflict('./')) 
    .pipe(gulp.dest('./'));
});

gulp.task('modify-package', function(done) {
  return gulp.src(__dirname + '/package.json')
    .pipe(through.obj(function(file, enc, next) {
      var data = JSON.parse(file);
      Object.assign(data.devDependencies, pkg.dependencies);
      next(null, new Buffer(data));
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function(done) {
  sequence(['copy-template', 'modify-package'], done);
});