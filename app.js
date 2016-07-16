var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './frontend'));
app.set('view engine', 'ejs');

// app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));

// Use the 'NODE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}

var routes = require('./routes/routes.js')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(process.env.PORT || 3000);
