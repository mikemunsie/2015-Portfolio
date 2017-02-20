const eventEmitter =  require('events').EventEmitter;
const Build = require("./build");

Build.devEnvironment = true;
eventEmitter.prototype._maxListeners = 100;
Build.cleanAppJS()
  .then(Build.cleanCSS)
  .then(Build.createAppJS)
  .then(Build.createContentCSS)
  .then(function() {
    Build.startServer();
    Build.startBrowserSync();
    Build.watch();
  });