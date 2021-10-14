const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const connection = require('./database');
const User = require('../models/user');

const verifyCallback = () => {
  // look for user in database
  User.findOne({ username }, (err, user) => {
    // error accessing the database
    if (err) return done(err);
    // no user found
    if (!user) {
      return done(null, false, { message: 'Incorrect username.'});
    }
    // hash password and compare it to password hash stored in DB
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) { // a match was found
        return done(null, user);
      } else { // no match found
        return done(null, false, { message: 'Incorrect password.'});
      }
    });
  });
};

// traditional authentication strategy with a username and a password
const passwordStrategy = new LocalStrategy(verifyCallback);

passport.use(passwordStrategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});