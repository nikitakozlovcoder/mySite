const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const process = require('process');
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');
const session = require('express-session');
const crypto = require("crypto");
const app = express();



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(session({
  secret: crypto.randomBytes(10).toString('hex'),
  resave: true,
  saveUninitialized: false,
  cookie: { }
}));

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}));
app.use(express.urlencoded({ extended: false }));


//app.use("/public",express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/posts', postsRouter.route);
app.use('/admin', adminRouter);


app.use(function(req, res, next) {
  res.status(404).render('404')
});


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen((process.env.PORT || 3000),"127.0.0.1", function () {
  console.log("server is running on port "+(process.env.PORT || 3000) )
});


