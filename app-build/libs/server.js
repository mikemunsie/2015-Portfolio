const spawn = require('child_process').spawn;

var node;

module.exports = {
  start
}

function start() {
  Libs.helpers.logStart("Libs.server.start");
  return new Promise(function(resolve, reject) {
    if (node) node.kill();
    node = spawn('node', ['./server/app'], {
      env: _.extend(process.env, {
        DEBUG: "app"
      }),
      stdio: 'inherit'
    })
    node.on('close', function (code) {
      if (code === 8) {
        gulp.log('Error detected, waiting for changes...');
      }
    });
    resolve();
  });
}
