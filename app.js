const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const favicon = require('serve-favicon');
const ENV = require('./app-env');
const findOrCreate = require('mongoose-findorcreate');

const index = require('./routes/index');
const users = require('./routes/users');
// const db = require('./models');

// Middleware
app.use(cookieParser());
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png'))); 


const googleClientKey = ENV.GOOGLE_CLIENT_ID;
const googleClientSecret = ENV.GOOGLE_CLIENT_SECRET;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// app.use(app.router);

app.use('/', index);
app.use('/users', users);

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: googleClientKey,
    clientSecret: googleClientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({ 'google.id': profile.id }, function (err, user) {
			return done(err, user);
		});
  }
));

/**********
 * SERVER *
 **********/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

app.get('/', function(req, res){
  res.render('index', {user: "req.user"});
});

app.get('/logout', () => {
  req.logout();
  res.redirect('/')
});    

module.exports = app;
