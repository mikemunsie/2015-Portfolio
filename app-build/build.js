var argv = require('yargs').argv;

// Define build environment
if (!process.env.BUILD_ENV) process.env.BUILD_ENV = argv.env ? argv.env : "production";
process.env.NODE_ENV = process.env.BUILD_ENV === "local" ? "development" : "production";

console.log("Using Settings: " + JSON.stringify({
  NODE_ENV: process.env.NODE_ENV,
  BUILD_ENV: process.env.BUILD_ENV
}) + "\n");

// Globals
global._ = require("lodash");
global.gulp = require("gulp");
global.gulpif = require("gulp-if");
global.plumber = require("gulp-plumber");
global.fs = require("fs");
global.Libs = {};
global.host = "localhost";

global.buildSettings = {
  devServerPort: 9000
};

// Libs
require("fs").readdirSync(require("path").join(__dirname, "libs")).forEach(function(file) {
  if (file.indexOf(".js") < 0) return;
  global.Libs[file.split(".js")[0]] = require("./libs/" + file);
});