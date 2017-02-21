var gulpUtil = require("gulp-util");
var notifier = require("node-notifier");
var gulpPrompt = require("gulp-prompt");

module.exports = {
  logEnd,
  logError,
  logStart,
  showError
};

function logStart(name) {
  return gulpUtil.log(gulpUtil.colors.green("Started: " + name));
}

function logEnd(name) {
  return gulpUtil.log(gulpUtil.colors.blue("(completed) - " + name));
}

function logError(err) {
  gulpUtil.log(gulpUtil.colors.red(err));
  if (process.env.NODE_ENV === "development") {
    notifier.notify({
      title: "Error",
      message: err
    });
  }
}

function showError(msg){
  gulpUtil.log(gulpUtil.colors.red(msg));
}