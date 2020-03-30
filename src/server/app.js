var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var indexRouter = require('./routes/index');
var User = require('./routes/users');
var Report = require('./routes/report');
var Bank = require('./routes/bank');
var Designation = require('./routes/designation');
var Department = require('./routes/department');
var DefaultColumn = require('./routes/defaultColumn');
var Shift = require('./routes/shift');
var cors = require('cors');
var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/data',express.static(path.join(__dirname, '/data/')));

// app.use(app.router);
// indexRouter.initialize(app);
app.use('/', indexRouter);
app.use('/User', User);
app.use('/Report',Report)
app.use('/Bank',Bank)
app.use('/Designation',Designation)
app.use('/Department',Department)
app.use('/DefaultColumn',DefaultColumn)
app.use('/Shift',Shift)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});
module.exports = app;
