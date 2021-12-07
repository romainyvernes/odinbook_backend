const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// import DB connection
require('./database');
const User = require('../models/user');

const verifyCallback = (email, password, done) => {
  // look for user in database
  User.findOne({ email }, (err, user) => {
    // error accessing the database
    if (err) return done(err);
    // no user found
    if (!user) {
      return done(null, false, { 
        email: {
          msg: 'Incorrect email.'
        }
      });
    }
    // hash password and compare it to password hash stored in DB
    bcrypt.compare(password, user.password, (err, found) => {
      if (found) { // a match was found
        return done(null, user);
      } else { // no match found
        return done(null, false, { 
          password: {
            msg: 'Incorrect password.'
          }
        });
      }
    });
  });
};

// standard authentication strategy with an email (instead of default username)
// and a password
const passwordStrategy = new LocalStrategy(
  { usernameField: 'email'}, 
  verifyCallback
);

passport.use(passwordStrategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;