var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// enable environment variables
require('dotenv').config();

// import database connection
const connection = require('./config/database');

var app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": [
          "'self'", 
          "romainodinbook.s3.us-west-2.amazonaws.com",
          "data:",
          "blob:",
          "odinbook-boqn.onrender.com"
        ]
      }
    }
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.resolve(__dirname, './client/build')));

// SESSION STORE
const MongoStore = require('connect-mongo');
const sessionStore = MongoStore.create({
  clientPromise: connection,
  collectionName: 'sessions'
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // previously set to true
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 10 // 1 day in milliseconds
  }
}));

// AUTHENTICATION

// import passport config module
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// import custom auth middleware that ensures user is authenticated
const isAuth = require('./auth/authMiddleware').isAuth;

app.use(compression());

// ROUTES

// import routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const reactionsRouter = require('./routes/reactions');

app.use('/api/auth', authRouter);
// check user is authenticated before allowing access to unprotected routes
app.use(isAuth); 
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/reactions', reactionsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// ERRORS

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.json(err)
});

module.exports = app;
