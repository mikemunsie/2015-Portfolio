const express = require('express');
const debug = require('debug')('app');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust = require('dustjs-helpers');

// Routes
const routes_views = require('./routes/views');

// Dust Config
dust.config.whitespace = true;

// view engine setup
let app = express();
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use((req, res, next) => {
  if (!(req.headers.host.indexOf('munstrocity') > -1 || req.headers.host.indexOf('localhost') > -1)) {
    res.render('stop');
    res.status('200');    
  }
  next();
});


app.use('/app', express.static(path.join(__dirname, '../app')));
app.use('/', routes_views);

// 404 page
app.use((req, res, next) => {
  res.status(404);
  res.render('404', {
    title: "404",
    preview: "This is a 404 page."
  });
});

// 500 errors
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    title: 500,
    preview: "Well something happened.",
    message: err.message
  });
});

// Start up the server
var port = 9000;
if (process.env.PORT) port = process.env.PORT;
app.listen(port, () => {
  debug('Express server listening on port ' + port);
});