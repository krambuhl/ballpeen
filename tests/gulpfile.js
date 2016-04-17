// Task `styles`
// compiles stylesheet and optimises file 
gulp.task('styles', function() {
  return gulp.src(options.src)
    .pipe(styles({
      autoprefixer: { browsers: ['ie10+'] },
      transforms: [ ]
    }))
    .pipe(gulp.dest(dirs.assets));
});