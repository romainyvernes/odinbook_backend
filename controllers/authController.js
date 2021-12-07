const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// POST authenticate existing user
exports.login = [
  body('email').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Email address is required.')
                  .isEmail()
                  .withMessage('Email address is invalid.'),
  body('password').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Password is required.'),

  handleValidationErrors,

  (req, res, next) => {
    // use passport within controller to have access to req/res objects to send
    // customize error handling in case of failed authentication
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json(info);
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        
        const {
          username,
          id,
          name,
          friend_requests_sent,
          friend_requests_received,
          friends,
          picture,
          ...rest
        } = req.user;
        
        res.json({
          username,
          id,
          name,
          incomingFriendRequests: friend_requests_received,
          outgoingFriendRequests: friend_requests_sent,
          friends,
          picture
        });
      });
    })(req, res, next);
  }
];

// GET log out current user
exports.logout = (req, res, next) => {
  req.logout();
  res.sendStatus(200);
};

// POST create new user
exports.register = [
  body('username').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Username is required.')
                  .not()
                  .isIn(['friends', 'settings'])
                  .withMessage('Invalid username.'),
  body('password').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Password is required.'),
  body('email').trim()
               .isLength({ min: 3 })
               .escape()
               .withMessage('Email address is required.')
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
    User.findOne(
      { $or: [
          { username: req.body.username },
          { email: req.body.email }
        ] 
      }, 
      (err, user) => {
        if (err) return next(err);
        if (user) return res.status(401).json({ 
          username: {
            msg: 'Username or email are already taken.'
          },
          email: {
            msg: 'Username or email are already taken.'
          }, 
        });

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

// GET check authentication
exports.verify = (req, res, next) => {
  // if user gets to this point, they must be authenticated and can retrieve
  // username to maintain seamless experience on client side
  const {
    username,
    id,
    name,
    friend_requests_sent,
    friend_requests_received,
    friends,
    picture,
    ...rest
  } = req.user;
  
  res.json({
    username,
    id,
    name,
    incomingFriendRequests: friend_requests_received,
    outgoingFriendRequests: friend_requests_sent,
    friends,
    picture,
  });
};
