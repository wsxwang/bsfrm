var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// route to restful api
var custom_entity = require('./routes/custom_entity');
var custom_relation = require('./routes/custom_relation');
var users = require('./routes/users');
// route to page
var debug = require('./routes/debug');
var home = require('./routes/home');





var login = require('./routes/login');
var admin = require('./routes/admin');
var tasks = require('./routes/tasks');

var app = express();

// 不使用模板渲染
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 允许跨域访问
app.use('/', function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use('/api/custom_entity', custom_entity);
//app.use('/api/custom_relation', custom_relation);
app.use('/api/users', users);
app.use('/debug', debug);
app.use('/', home);

app.use('/', login);
app.use('/login', login);
app.use('/admin', admin);
app.use('/tasks', tasks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
