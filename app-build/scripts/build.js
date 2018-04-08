require('../build');

Libs.clean.apps()
  .then(Libs.webpack.setup)
  .then(Libs.sass.compile)