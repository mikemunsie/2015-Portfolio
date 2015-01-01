var _ =             require("lodash-node");
var browserify =    require('gulp-browserify');
var browserSync =   require("browser-sync");
var del =           require("del");
var concat =        require('gulp-concat');
var eventEmitter =  require('events').EventEmitter;
var fs =            require('fs');
var glob =          require("glob");
var gulp =          require("gulp");
var gulpif =        require("gulp-if");
var gulpUtil =      require("gulp-util");
var gulpWatch =     require("gulp-watch");
var minifyCSS =     require("gulp-minify-css");
var minifyHtml =    require('gulp-minify-html');
var ngAnnotate =    require('gulp-ng-annotate');
var ngHtml2Js =     require('gulp-ng-html2js');
var Q =             require("q");
var path =          require("path");
var plumber =       require("gulp-plumber");
var sass =          require("gulp-sass");
var shell =         require("gulp-shell");
var spawn =         require('child_process').spawn;
var sourcemaps =    require("gulp-sourcemaps");
var uglify =        require('gulp-uglify');
var walk =          require('walk');

// ====================================
// Globals
// ====================================

var devEnvironment = false;
var fastDev = false;
var port = 9003;

var angularFolders = [
  "angular_components",
  "angular_layouts",
  "angular_views"
];

var browserSyncConfig = {
  files: [
    "app/public/images/**/*",
    "app/public/javascripts-min/apps/**/*.js",
    "app/public/javascripts-min/packages/**/*.js",
    "app/public/stylesheets/**/*.css",
    "app/public/mocks/**/*.json"
  ],
  browsers: ["google chrome"],
  proxy: "http://localhost:" + port + "/",
  injectChanges: true,
  reloadDelay: 1000
};

var packages = {
  "global": [
    "./app/public/vendor/jquery/dist/jquery.min.js",
    "./app/public/javascripts-min/commonJS/site.js",
    "./app/public/vendor-local/syntax/scripts/shCore.js",
    "./app/public/vendor-local/syntax/scripts/shBrushCss.js",
    "./app/public/vendor-local/syntax/scripts/shBrushJScript.js",
    "./app/public/vendor-local/syntax/scripts/shBrushPhp.js",
    "./app/public/vendor-local/syntax/scripts/shBrushSass.js"
  ]
};

// ====================================
// Tasks
// ====================================

gulp.task('prod', function() {
  var deferred = Q.defer();
  cleanAppJS()
    .then(cleanCSS)
    .then(createAppJS)
    .then(createContentCSS)
    .then(createAppCSS)
    .then(function() {
      shell.task([
        "forever stop munstrocity.com",
        "PORT=8080 forever --uid munstrocity.com start app/bin/www"
      ], {
        ignoreErrors: true
      })();
      deferred.resolve();
    });
  return deferred.promise;
});

gulp.task("dev", function () {
  var deferred = Q.defer();
  devEnvironment = true;
  eventEmitter.prototype._maxListeners = 100;
  cleanAppJS()
    .then(cleanCSS)
    .then(createAppJS)
    .then(createContentCSS)
    .then(createAppCSS)
    .then(function() {
      startServer();
      startBrowserSync();
      watch();
    });
  return deferred.promise;
});

// ====================================
// Helpers
// ====================================

function helpers_logStart(name) {
  return gulpUtil.log(gulpUtil.colors.green("Started: " + name));
}

function helpers_logEnd(name) {
  return gulpUtil.log(gulpUtil.colors.blue("(completed) - " + name));
}

function helpers_logError(err) {
  return gulpUtil.log(gulpUtil.colors.red(err));
}

function helpers_showError(msg){
  gulpUtil.log(gulpUtil.colors.red(msg));
}

function helpers_getAppNames() {
  var apps = [];
  var files = fs.readdirSync("./app/public/angular_apps");
  _.forEach(files, function(file) {
    file = file.replace("app_", "");
    file = file.replace(".js", "");
    apps.push(file);
  });
  return apps;
}

function executePromisesBasedOnEnvironment(promiseQueue, callback) {
  var qArray = [];

  // Blitz if we are in dev
  if (devEnvironment) {
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

function sequentiallyExecutePromiseQueue(promiseQueue, index, callback) {
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

function browserifyApps() {
  var deferred = Q.defer();
  var apps = helpers_getAppNames();
  var promiseQueue = [];
  helpers_logStart("Browserify Apps.");
  _.forEach(apps, function(app) {
    promiseQueue.push(function() {
      var deferred = Q.defer();
      gulp
        .src('./app/public/angular_apps/' + app + '/' + app + '.js')
        .pipe(plumber(function(err){
          helpers_showError(err);
          return deferred.resolve();
        }))
        .pipe(browserify({
          insertGlobals : false,
          debug: false
        }))
        .pipe((gulpif(!devEnvironment, uglify({
          mangle: false
        }))))
        .pipe(gulp.dest('./app/public/javascripts-min/apps/'))
        .on('end', function() {
          return deferred.resolve();
        });
      return deferred.promise;
    });
  });

  executePromisesBasedOnEnvironment(promiseQueue, function() {
    helpers_logEnd("Browserify Apps.");
    return deferred.resolve();
  });

  return deferred.promise;
}

function cleanCSS(){
  var deferred = Q.defer();
  helpers_logStart("Clean CSS");
  del.sync(["./app/public/stylesheets/"], {
    force: true
  });
  helpers_logEnd("Clean CSS");
  deferred.resolve();
  return deferred.promise;
}

function cleanAppJS(){
  var deferred = Q.defer();
  helpers_logStart("Clean App JS");
  del.sync(["./app/public/javascripts-min/"], {
    force: true
  });
  helpers_logEnd("Clean App JS");
  deferred.resolve();
  return deferred.promise;
}

function createAppCSS() {
  var deferred = Q.defer();
  var promiseQueue = [];
  var folders = [];
  var appNames = helpers_getAppNames();
  helpers_logStart("Create Application CSS Files");

  // Walk through the angular app folders and compile the SCSS stuffs
  _.forEach(appNames, function(app) {
    promiseQueue.push(function() {
      var deferred = Q.defer();
      gulp.src("./app/public/angular_apps/" + app + "/*.scss")
      .pipe(plumber(function(err){
        helpers_logError(err);
        return deferred.resolve();
      }))
      .pipe(gulpif(devEnvironment, sourcemaps.init()))
      .pipe(sass({
        onError: function(err) {
          return gulpUtil.log(gulpUtil.colors.red(err));
        }
      }))
      .pipe(gulpif(devEnvironment, sourcemaps.write()))
      .pipe(gulpif(!devEnvironment, minifyCSS({keepBreaks: false})))
      .pipe(gulp.dest("./app/public/stylesheets/apps/" + app + "/"))
      .on("end", function() {
        return deferred.resolve();
      });
      return deferred.promise;
    });
  });

  executePromisesBasedOnEnvironment(promiseQueue, function() {
    helpers_logEnd("Browserify Angular Apps.");
    return deferred.resolve();
  });

  return deferred.promise;
}

function createContentCSS() {
  var deferred = Q.defer();
  helpers_logStart("Create CSS");
  gulp.src("./app/public/sass/**/*.scss")
  .pipe(plumber(function(err){
    helpers_logError(err);
    return deferred.resolve();
  }))
  .pipe(gulpif(devEnvironment, sourcemaps.init()))
  .pipe(sass({
    onError: function(err) {
      return gulpUtil.log(gulpUtil.colors.red(err));
    }
  }))
  .pipe(gulpif(devEnvironment, sourcemaps.write()))
  .pipe(gulpif(!devEnvironment, minifyCSS({keepBreaks: false})))
  .pipe(gulp.dest("./app/public/stylesheets"))
  .on("end", function() {
    helpers_logEnd("Successfully Created CSS");
    return deferred.resolve();
  });
  return deferred.promise;
}

function createAppJS() {
  var deferred = Q.defer();
  convertHTMLTemplatesToJS()
    .then(browserifyApps)
    .then(minifyCommonJS)
    .then(concatPackages)
    .then(deferred.resolve);
  return deferred.promise;
}

function concatPackages() {
  helpers_logStart("Concat Packages");
  var deferred = Q.defer();
  var promiseQueue = [];
  var fileName = "";
  var package_prefix = "package-";

  // If you are in dev, replace minified files with unminified files
  if (devEnvironment) {
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

function convertHTMLTemplatesToJS() {
  helpers_logStart("convertHTMLTemplatesToJS");
  var deferred = Q.defer();
  var promise;
  var promiseQueue = [];
  _.forEach(angularFolders, function(templateFolder) {
    promiseQueue.push(function() {
      var deferred = Q.defer();
      gulp
        .src("./app/public/" + templateFolder + "/**/*.html")
        .pipe(plumber(function(err){
          helpers_showError(err);
          return deferred.resolve();
        }))
        .pipe(minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        }))
        .pipe(ngHtml2Js({
          moduleName: "angularTemplates2JS",
          prefix: "/public/" + templateFolder + "/"
        }))
        .pipe((gulpif(!devEnvironment, uglify({
          mangle: false
        }))))
        .pipe(gulp.dest("./app/public/javascripts-min/templates/" + templateFolder))
        .on('end', deferred.resolve);
      return deferred.promise;
    });
  });

  executePromisesBasedOnEnvironment(promiseQueue, function() {
    helpers_logEnd("convertHTMLTemplatesToJS");
    return deferred.resolve();
  });

  return deferred.promise;
}

function minifyCommonJS() {
  var deferred = Q.defer();
  helpers_logStart("Minify CommonJS");
  gulp
    .src('./app/public/commonJS/*.js')
    .pipe(plumber(function(err){
      helpers_showError(err);
      return deferred.resolve();
    }))
    .pipe((gulpif(!devEnvironment, uglify({
      mangle: false
    }))))
    .pipe(gulp.dest('./app/public/javascripts-min/commonJS/'))
    .on('end', function() {
      helpers_logEnd("Minify CommonJS");
      return deferred.resolve();
    });
  return deferred.promise;
}

function startBrowserSync() {
  helpers_logStart("Starting BrowserSync.");
  var deferred = Q.defer();
  browserSync.init([], browserSyncConfig);
  deferred.resolve();
  return deferred.promise;
}

function startServer() {
  helpers_logStart("Starting Server.");
  var deferred = Q.defer();
  deferred.resolve();
  shell.task([
    "PORT=" + port + " nodemon --watch app/views --watch app/routes --watch app/app.js app/bin/www"
  ], {
    "ignoreErrors": true
  })();
  return deferred.promise;
}

function watch() {
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
    minifyCommonJS()
      .then(concatPackages);
  });

  // Watch APP JS changes
  gulpWatch([
    "app/public/angular_apps/**/*",
    "app/public/angular_components/**/*",
    "app/public/angular_views/**/*",
    "app/public/angular_layouts/**/*",
    "!app/public/**/*.scss",
    "!app/public/**/*.spec.js"
  ], function () {
    createAppJS();
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
    createContentCSS();
  });

  // Watch for App SASS changes
  gulpWatch([
    "app/public/angular_apps/**/*.scss",
    "app/public/angular_components/**/*.scss",
    "app/public/angular_layouts/**/*.scss",
    "app/public/angular_views/**/*.scss"
  ], function() {
    createAppCSS();
  });

}