const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const saveLicense = require('uglify-save-license');
const WriteFilePlugin = require('write-file-webpack-plugin');

const hotModulePlugins = [
  `webpack-dev-server/client?http://${global.host}:3000`,
  'webpack/hot/only-dev-server'
];

const webpackModule = {
  rules: [
    {
      test: /\.js?$/,
      exclude: /node_modules/,
      use: ['babel-loader?cacheDirectory']
    },
    {
      test: /\.css/,
      use: ExtractTextPlugin.extract({
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: process.env.BUILD_ENV !== "local"
            }
          }
        ]
      }),
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: process.env.BUILD_ENV !== "local"
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }),
    },
    {
      test: /\.json?$/,
      use: 'json-loader'
    },
    {
      test: /\.(jpg|png|svg)$/,
      use: 'file-loader'
    }
  ]
};

const plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "BUILD_ENV": JSON.stringify(process.env.BUILD_ENV),
    },
  }),
  new ExtractTextPlugin({
    filename: 'style.css',
    allChunks: true
  })
];

// Settings for BUILD_ENV vs dev
if (process.env.NODE_ENV !== "development") {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    comments: saveLicense,
    minimize: true
  }));
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NamedModulesPlugin());
  plugins.push(new WriteFilePlugin({
    test: /\.css$/
  }));
}

const commonBuildSettings = {
  devtool: 'source-map',
  target: "web",
  performance: { hints: false }
};

const buildCustomEntry = (file, key) => {
  if (process.env.BUILD_ENV === "local" && key !== "vendors") {
    let files = hotModulePlugins;
    files = files.concat(file);
    return files;
  } else {
    return file;
  }
};

const buildCustomApp = (config) => {

  // Rebuild the entries so we pop in the appropiate plugins
  _.each(config.entries, (file, name) => {
    config.entries[name] = buildCustomEntry(file, name);
  });

  // I had to perform a clone deep otherwise this won't map correctly.
  const webpackConfig = _.extend(_.cloneDeep(commonBuildSettings), {
    entry: config.entries,
    output: {
      pathinfo: process.env.BUILD_ENV === "local",
      path: path.join(__dirname, '../../../app/dist'),
      filename: '[name].js',
      publicPath: '/app/dist/'
    },
    module: webpackModule,
    plugins
  });

  return webpackConfig;
};

module.exports = (settings) => {
  let apps = [ buildCustomApp(require('./apps/munstrocity')) ];
  return apps;
};