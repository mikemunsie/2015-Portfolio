var sourcemaps = require("gulp-sourcemaps");
var minifyCSS = require("gulp-cssnano");
var sass = require("gulp-sass");

module.exports = {
  compile
}

function compile() {
  return new Promise((resolve, reject) => {
    Libs.helpers.logStart("Libs.sass.compile");
    gulp.src("app/styles/**/*.scss")
    .pipe(plumber(function(err){
      Libs.helpers.logError(err.message);
      return resolve();
    }))
    .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.init()))
    .pipe(sass({
      onError: (err) => {
        return Libs.helpers.logError(err.message);
        resolve();
      }
    }))
    .pipe(gulpif(process.env.NODE_ENV === "development", sourcemaps.write()))
    .pipe(gulpif(process.env.NODE_ENV !== "development", minifyCSS({keepBreaks: false})))
    .pipe(gulp.dest("app/dist/styles"))
    .on("end", function() {
      Libs.helpers.logEnd("Libs.sass.compile");
      return resolve();
    });
  });
}
