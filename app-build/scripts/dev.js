process.env.BUILD_ENV = 'local';
require("../build");

Libs.clean.apps()
.then(Libs.sass.compile)
.then(() => {
  Libs.browserSync.start();
  Libs.webpack.start();
  Libs.server.start();
  Libs.watch.watch();
});