var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server");

module.exports = {
  setup,
  start
}

function setup() {
  return new Promise(function(resolve, reject) {
    Libs.helpers.logStart("Libs.webpack.setup");
    var compiler;
    try {
      var compiler = webpack(require("./webpack/webpack.config.js")(buildSettings));
    } catch(e) {
      Libs.helpers.logError(e);
      return resolve();
    }
    compiler.run((err, stats) => {
      Libs.helpers.logEnd("Libs.webpack.setup");
      if (err) Libs.helpers.logError(err);
      resolve();
    });
  });
}

function start() {
  Libs.helpers.logStart("Libs.webpack.start");
  try {
    var webpackConfig = require("./webpack/webpack.config.js")(buildSettings);
    var webpackSettings = {
      hot: true,
      inline: true,
      historyApiFallback: false,
      proxy: {
        "*": `http://${global.host}:${buildSettings.devServerPort}`
      },
      publicPath: "/app/dist/"
    };
    var server = new webpackDevServer(webpack(webpackConfig), webpackSettings);
  } catch(e) {
    console.log(e);
  }
  server.listen(3000, global.host, function() {});
}
