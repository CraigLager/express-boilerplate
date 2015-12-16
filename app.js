var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var app = express();

// set easy to access flag for development environment
__dev = app.get('env') === 'development'

// set config up
config = require('./config/app.' + (__dev ? "dev" : "production") + '.config');


// compress all requests
if(config.compression)
{
  console.log("Enabling compression");
  app.use(compression())
}

// bundle management
console.log("Building bundles");
require('express-simple-bundler').bundle(require('./config/bundle.config.js').bundleSettings);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up controllers
var controllers = setControllers(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function setControllers(app){
  console.log("Initializing controllers")

// get a list of controllers
// https://github.com/isaacs/node-glob
  var glob = require("glob");

var files = glob.sync("./controllers/*.js", {});
  files.forEach(function(f){
    var path = f.replace('.js','').replace('./controllers/','/');
    var mod = f.replace('.js','');

    // index is the home route
    if(path==='/index')
    {
      path='/';
    }

    var controller = {file:f,path:path,module:mod}
    app.use(controller.path,require(controller.module));
    console.log(controller);
  });

return controllers;

}

// database init
if(config.databaseInit)
{
  db = require('./db.js')
  itemRepo = require('./itemRepo.js')
  db.init();
}

process.on( 'SIGINT', function() {
  console.warn("Shutting down");
  if(config.databaseInit)
  {
    db.close();
  }
  process.exit( );
})

module.exports = app;
