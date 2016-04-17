const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer-core');

module.exports = function(options = {}) {
  const prefOpts = Object.assign({ browsers: ['last 2 version'] }, options.autoprefixer);
  const transforms = [ autoprefixer(prefOpts) ];
  const sourcemap = options.sourcemap || '.';

  if (options.transforms) { transforms.concat(transforms); }

  return function() {
    return stream
      .pipe(sourcemaps.init())     
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(transforms))
      .pipe(csslint())
      .pipe(gulpIf(options.production).pipe(cssmin).pipe(mqcombiner))
      .pipe(sourcemaps.write(sourcemap));
  };
};