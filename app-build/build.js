const _ =             require("lodash-node");
const browserify =    require('gulp-browserify');
const browserSync =   require("browser-sync");
const del =           require("del");
const concat =        require('gulp-concat');
const fs =            require('fs');
const glob =          require("glob");
const gulp =          require("gulp");
const gulpif =        require("gulp-if");
const gulpUtil =      require("gulp-util");
const gulpWatch =     require("gulp-watch");
const minifyCSS =     require("gulp-minify-css");
const minifyHtml =    require('gulp-minify-html');
const ngAnnotate =    require('gulp-ng-annotate');
const ngHtml2Js =     require('gulp-ng-html2js');
const Q =             require("q");
const path =          require("path");
const plumber =       require("gulp-plumber");
const sass =          require("gulp-sass");
const shell =         require("gulp-shell");
const spawn =         require('child_process').spawn;
const sourcemaps =    require("gulp-sourcemaps");
const uglify =        require('gulp-uglify');
const walk =          require('walk');

// ====================================
// Globals
// ====================================

exports.devEnvironment = false;
let fastDev = false;
let port = 9001;
let node = null;

const browserSyncConfig = {
  files: [
    "app/public/images/**/*",
    "app/public/javascripts-min/packages/**/*.js",
    "app/public/stylesheets/**/*.css",
    "app/public/mocks/**/*.json"
  ],
  browsers: ["google chrome"],
  proxy: "http://localhost:" + port + "/",
  injectChanges: true,
  reloadDelay: 1000
};

const packages = {
  "global": [
    "./app/public/vendor/jquery/dist/jquery.min.js",
    "./app/public/vendor/jquery-touchswipe/jquery.touchSwipe.min.js",
    "./app/public/javascripts-min/commonJS/site.js",
    "./app/public/vendor-local/syntax/scripts/shCore.js",
    "./app/public/vendor-local/syntax/scripts/shBrushCss.js",
    "./app/public/vendor-local/syntax/scripts/shBrushJScript.js",
    "./app/public/vendor-local/syntax/scripts/shBrushPhp.js",
    "./app/public/vendor-local/syntax/scripts/shBrushSass.js"
  ]
};

// ====================================
// Helpers
// ====================================

const helpers_logStart = (name) => {
  return gulpUtil.log(gulpUtil.colors.green("Started: " + name));
}

const helpers_logEnd = (name) => {
  return gulpUtil.log(gulpUtil.colors.blue("(completed) - " + name));
}

const helpers_logError = (err) => {
  return gulpUtil.log(gulpUtil.colors.red(err));
}

const helpers_showError = (msg) => {
  gulpUtil.log(gulpUtil.colors.red(msg));
}

const executePromisesBasedOnEnvironment = (promiseQueue, callback) => {
  var qArray = [];

  // Blitz if we are in dev
  if (exports.devEnvironment) {
    _.forEach(promiseQueue, function(promise) {
      qArray.push(promise());
    });
    Q.all(qArray).then(function() {
      return callback.call();
    });

  // One at a time for normal people
  } else {
    sequentiallyExecutePromiseQueue(promiseQueue, 0, function() {
      return callback.call();
    });
  }
}

const sequentiallyExecutePromiseQueue = (promiseQueue, index, callback) => {
  if (index >= promiseQueue.length) {
    return callback.call();
  }
  promiseQueue[index]()
    .then(function() {
      sequentiallyExecutePromiseQueue(promiseQueue, index+1, callback);
    });
}

// ====================================
// Routines
// ====================================

exports.cleanCSS = () => {
  var deferred = Q.defer();
  helpers_logStart("Clean CSS");
  del.sync(["./app/public/stylesheets/"], {
    force: true
  });
  helpers_logEnd("Clean CSS");
  deferred.resolve();
  return deferred.promise;
}

exports.cleanAppJS = ()=> {
  var deferred = Q.defer();
  helpers_logStart("Clean App JS");
  del.sync(["./app/public/javascripts-min/"], {
    force: true
  });
  helpers_logEnd("Clean App JS");
  deferred.resolve();
  return deferred.promise;
}

exports.createContentCSS = () => {
  var deferred = Q.defer();
  helpers_logStart("Create CSS");
  gulp.src("./app/public/sass/**/*.scss")
  .pipe(plumber(function(err){
    return deferred.resolve();
  }))
  .pipe(gulpif(exports.devEnvironment, sourcemaps.init()))
  .pipe(sass({
    onError: function(err) {
      return gulpUtil.log(gulpUtil.colors.red(err.message));
    }
  }))
  .pipe(gulpif(exports.devEnvironment, sourcemaps.write()))
  .pipe(gulpif(!exports.devEnvironment, minifyCSS({keepBreaks: false})))
  .pipe(gulp.dest("./app/public/stylesheets"))
  .on("end", function() {
    helpers_logEnd("Successfully Created CSS");
    return deferred.resolve();
  });
  return deferred.promise;
}

exports.createAppJS = () => {
  var deferred = Q.defer();
  exports.minifyCommonJS()
    .then(exports.concatPackages)
    .then(deferred.resolve);
  return deferred.promise;
}

exports.concatPackages = () => {
  helpers_logStart("Concat Packages");
  var deferred = Q.defer();
  var promiseQueue = [];
  var fileName = "";
  var package_prefix = "package-";

  // If you are in dev, replace minified files with unminified files
  if (exports.devEnvironment) {
    _.forEach(packages, function(packageFiles, packageFilesIndex) {
      _.forEach(packageFiles, function(packageFile, packageFileIndex) {
        if (fs.existsSync(packageFile.replace(".min.js", ".js"))) {
          packages[packageFilesIndex][packageFileIndex] = packageFile.replace(".min.js", ".js");
        }
      });
    });
  }

  Object.keys(packages).forEach(function (key) {
    promiseQueue.push(function() {
      var deferred = Q.defer();
      fileName = package_prefix + key + ".js";
      gulp.src(packages[key])
        .pipe(plumber(function(err){
          helpers_showError(err);
          return deferred.resolve();
        }))
        .pipe(concat(fileName))
        .pipe(gulp.dest("./app/public/javascripts-min/packages/"))
        .on('end', deferred.resolve);
      return deferred.promise;
    });
  });

  executePromisesBasedOnEnvironment(promiseQueue, function() {
    helpers_logEnd("Concat Packages");
    return deferred.resolve();
  });

  return deferred.promise;
}

exports.minifyCommonJS = () => {
  var deferred = Q.defer();
  helpers_logStart("Minify CommonJS");
  gulp
    .src('./app/public/commonJS/*.js')
    .pipe(plumber(function(err){
      helpers_showError(err);
      return deferred.resolve();
    }))
    .pipe((gulpif(!exports.devEnvironment, uglify({
      mangle: false
    }))))
    .pipe(gulp.dest('./app/public/javascripts-min/commonJS/'))
    .on('end', function() {
      helpers_logEnd("Minify CommonJS");
      return deferred.resolve();
    });
  return deferred.promise;
}

exports.startBrowserSync = () => {
  helpers_logStart("Starting BrowserSync.");
  var deferred = Q.defer();
  browserSync.init([], browserSyncConfig);
  deferred.resolve();
  return deferred.promise;
}

exports.startServer = () => {
  if (node) node.kill()
  node = spawn('node', ['./app/bin/www'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
}

exports.watch = () => {
  helpers_logStart("Started watching for changes...");

  // Watch content changes
  gulpWatch([
    "app/views/**/*"
  ], function() {
    browserSync.reload();
  });

  // Watch common JS changes
  gulpWatch([
    "app/public/commonJS/*.js"
  ], function() {
    exports.minifyCommonJS()
      .then(exports.concatPackages);
  });


  // Watch public folder changes
  gulpWatch([
    "app/public/images/**/*",
    "app/public/javascripts-min/**/*",
    "app/public/mocks/**/*"
  ], function() {
    browserSync.reload();
  });

  // Watch for Content SASS changes
  gulpWatch([
    "app/public/sass/**/*.scss"
  ], function() {
    exports.createContentCSS();
  });

}