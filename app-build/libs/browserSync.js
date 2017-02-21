var browserSync = require("browser-sync");

module.exports = {
  start: start
};

/**
 * Starts the server and runs browser sync
 * @return {obj} [promise]
 */
function start() {
  Libs.helpers.logStart("Libs.browserSync.start");
  browserSync.init([], {
    files: [
      "app/**/*.css"
    ],
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    },
    browsers: ['google chrome'],
    injectChanges: true,
    proxy: `http://${global.host}:3000`,
    host: global.host,
    open: "internal",
    port: 3005,
    serveStatic: [
      {
        route: '',
        dir: 'app'
      }
    ]
  });
  Libs.helpers.logEnd("Libs.browserSync.start");
}