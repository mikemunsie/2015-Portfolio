var browserSync = require("browser-sync");
var gulpWatch = require("gulp-watch");

module.exports = {
  watch
};

function watch() {
  Libs.helpers.logStart("Libs.watch.watch");

  gulpWatch([
    "app/styles/**/*.scss"
  ], function() {
    Libs.sass.compile();
  });

  gulpWatch([
    "server/**/*"
  ], function () {
    Libs.server.start();
    setTimeout(function() {
      browserSync.reload();
    }, 1000);
  });
}