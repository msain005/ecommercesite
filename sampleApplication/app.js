var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var layouts = require('express-ejs-layouts');
const mysql = require('mysql');
const session = require('express-session');

const db = mysql.createConnection({
	host: 'localhost',
	user: 'samuser', 
	password: 'plepassd',
	database: 'sampledb'});

// connect to database
db.connect((err) => {
  if (err) 
  {
	console.log("Unable to connect to database due to error: " + err);
	res.render('error');
  } 
  else
  {
	console.log("Connected to DB");
  }
});
global.db = db;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var customerRouter = require('./routes/customer');
var productRouter = require('./routes/product');
var searchRouter = require('./routes/search');
var supplierRouter = require('./routes/supplier');
var categoryRouter = require('./routes/category');
var saleorderRouter = require('./routes/saleorder');
var orderdetailRouter = require('./routes/orderdetail');
var reviewRouter = require('./routes/review');
var subscriptionRouter = require('./routes/subscription');
var catalogRouter = require('./routes/catalog');
var reportRouter = require('./routes/report');
var privacyRouter = require('./routes/privacy');
var helpRouter = require('./routes/help');

var app = express();
app.use(layouts);

app.use(session({secret: 'SampleAppSecret'}));	// secret key is used for managing various sessions for the application
app.use(function(req,res,next){					
    res.locals.session = req.session;
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/customer', customerRouter);
app.use('/product', productRouter);
app.use('/search', searchRouter);
app.use('/supplier', supplierRouter);
app.use('/category', categoryRouter);
app.use('/saleorder', saleorderRouter);
app.use('/orderdetail', orderdetailRouter);
app.use('/review', reviewRouter);
app.use('/subscription', subscriptionRouter);
app.use('/catalog', catalogRouter);
app.use('/report', reportRouter);
app.use('/privacy', privacyRouter);
app.use('/help', helpRouter);

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

module.exports = app;
