const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// POST authenticate existing user
exports.login = [
  body('username').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Username is required.'),
  body('password').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Password is required.'),

  handleValidationErrors,

  passport.authenticate('local', { failureFlash: true }),

  (req, res, next) => {
    res.redirect(`/api/users/${req.user.id}`);
  }
];

// GET log out current user
exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
};

// POST create new user
exports.register = [
  body('username').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Username is required.'),
  body('password').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Password is required.'),
  body('email').trim()
               .isLength({ min: 3 })
               .escape()
               .withMessage('Email is required.')
               .isEmail()
               .withMessage('Email address is invalid.'),
  body('firstName').trim()
                   .notEmpty()
                   .escape()
                   .withMessage('First name is required.'),
  body('lastName').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Last name is required.'),

  handleValidationErrors,

  (req, res, next) => {
    // check that user is not already registered
    User.findOne({ username: req.body.username }, (err, user) => {
      if (err) return next(err);
      if (user) return res.json({ message: 'User already exists.' });

      // hash password and save new user into DB
      bcrypt.hash(req.body.password, 10, (err, hashed) => {
        if (err) return next(err);
        
        // create new user into DB
        User.create({
          username: req.body.username,
          password: hashed,
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email
        }, (err) => {
          if (err) return next(err);
          // indicates new user was successfully created
          res.sendStatus(201);
        });
      });
    });
  }
];