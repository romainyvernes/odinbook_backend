const bcrypt = require('bcryptjs');
const User = require('../models/user');

// POST create new user
exports.register = (req, res, next) => {
  // check that user is not already registered
  
  // hash password and save new user into DB
  bcrypt.hash(req.body.password, 10, (err, hashed) => {
    if (err) return next(err);
    
    // create new user into DB
    const user = new User({
      username: req.body.username,
      password: hashed
    }).save((err) => {
      if (err) return next(err);
      // indicates new user was successfully created
      res.status(200);
    });
  });
};

// POST authenticate existing user
exports.login = (req, res, next) => {
  res.redirect(`/api/users/${req.user.id}`);
};

// GET log out current user
exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};