const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// POST create new user
exports.register = (req, res, next) => {
  // check that user is not already registered
  
  bcrypt.hash(req.body.password, 10, (err, hashed) => {
    if (err) return next(err);
    
    // create new user into DB
    const user = new User({
      username: req.body.username,
      password: hashed
    }).save((err) => {
      res.redirect(`/users/${user._id}`);
    });
  });
};

// POST authenticate existing user
exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/'
});

// POST log out current user
exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};