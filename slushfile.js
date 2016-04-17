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

gulp.task('default', function (done) {
  inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: "Give your app a name",
    // Get app name from arguments by default 
    default: gulp.args.join(' '),
  }],
  function (answers) {
    if (!answers.moveon) {
      return done();
    }

    gulp.src(__dirname + '/template/**', { dot: true }) 
      .pipe(template(answers))
      // Rename dotfiles
      .pipe(rename(function (file) {
        if (file.basename[0] === '_') {
          file.basename = '.' + file.basename.slice(1)
        }
      }))
      // Confirms overwrites on file conflicts 
      .pipe(conflict('./')) 
      .pipe(gulp.dest('./')) 
      .pipe(install()) 
      .on('finish', function () {
        done();
      });
  });
});