var del = require("del");

module.exports = {
  apps
};

function apps() {
  return new Promise(function(resolve, reject) {
    Libs.helpers.logStart("Libs.clean.apps");
    del.sync([
      "./app/dist",
      "./src/main/resources/static"
    ], {
      force: true
    });
    resolve();
    Libs.helpers.logEnd("Libs.clean.apps");
  });
}