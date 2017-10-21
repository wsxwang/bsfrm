var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');

// route to restful api
var custom_entity = require('./routes/custom_entity');
var custom_relation = require('./routes/custom_relation');
var custom_entity_data = require('./routes/custom_entity_data');
var users = require('./routes/users');
// route to page
var debug = require('./routes/debug');
var home = require('./routes/home');





var login = require('./routes/login');
var admin = require('./routes/admin');
var tasks = require('./routes/tasks');

var app = express();

// 模板渲染改为ejs
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// ejs
app.set('views', path.join(__dirname, 'public/htmls'));
app.engine('html', require('ejs').renderFile);
app.set("view engine", "html"); 

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// 更改日志记录
app.use(logger('dev'));
// 按天分日志文件
/*
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
});
app.use(logger('short',{stream:accessLogStream}));
*/

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
app.use('/api/custom_entity_data', custom_entity_data);
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
  
  //... 错误处理未记录日志
  console.error(err);
  res.render('error');
});



module.exports = app;
