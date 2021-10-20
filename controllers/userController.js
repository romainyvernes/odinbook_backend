const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// GET user's homepage with profile info, posts, and their respective comments
exports.index = (req, res, next) => {
  // if only user's account information is requested
  if (req.query.accountInfo === 'true') {
    if (req.params.userId === req.user.id) {
      return User.findById(
                   req.params.userId, 
                   'username email last_name first_name'
                 )
                 .exec((err, user) => {
                   if (err) return next(err);
                   res.json(user);
                 });
    } else {
      return res.sendStatus(403);
    }
  }
  // query DB for both user and posts at the same time
  Promise.all([
    User.findById(req.params.userId, 'last_name first_name friends')
        .populate('friends', 'last_name first_name name')
        .exec(),
    Post.find({ destination_profile: req.params.userId })
        .sort('-date')
        .populate('author', 'last_name first_name name')
        .populate({ 
          path: 'comments', 
          populate: [
            { 
              path: 'author', 
              select: 'last_name first_name name' 
            },
            { 
              path: 'reactions',
              populate: {
                path: 'author',
                select: 'last_name first_name name'
              }
            }
          ]
        })
        .populate({ 
          path: 'reactions', 
          populate: { path: 'author', select: 'last_name first_name name' }
        })
        .exec()
  ]).then(([userDoc, postDocs]) => {
    res.json({ profile_data: userDoc, posts: postDocs });
  }).catch((err) => next(err));
};

// PUT update user's account details
exports.update_account = [
  body('password').trim().escape(),
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
    const updateObj = {
      password: req.body.password !== '' ? req.body.password : undefined,
      email: req.body.email !== '' ? req.body.email : undefined,
      first_name: req.body.firstName !== '' ? req.body.firstName : undefined,
      last_name: req.body.lastName !== '' ? req.body.lastName : undefined
    };

    User.findByIdAndUpdate(
      req.params.userId, 
      updateObj,
      { new: true },
      (err, updatedUser) => {
        if (err) return next(err);
        // remove sensitive or irrelevant info from user object before sending it
        // to client
        const { 
          username,
          password, 
          friends, 
          friend_requests_sent, 
          friend_requests_received,
          ...sanitizedUser
        } = updatedUser.toObject();
        res.status(200).json(sanitizedUser);
      }
    );
  }
];

// DELETE delete user's account
exports.delete_account = (req, res, next) => {
  Promise.all([
    User.findByIdAndDelete(req.params.userId).exec(),
    Post.deleteMany({ $or: [
      { author: req.params.userId },
      { destination_profile: req.params.userId }
    ] }).exec(),
    Comment.deleteMany({ author: req.params.userId }).exec(),
    Reaction.deleteMany({ author: req.params.userId }).exec()
  ]).then(() => {
    res.redirect('/register');
  }).catch((err) => next(err));
};

// GET list of user's friends
exports.friends_list = (req, res, next) => {
  User.findById(req.params.userId, 'last_name first_name friends')
      .populate('friends', 'last_name first_name name')
      .exec((err, friends) => {
        if (err) return next(err);
        res.json(friends);
      });
};

// POST add new friend (i.e., accept friend request)
exports.friends_add = (req, res, next) => {
  Promise.all([
    User.findByIdAndUpdate(
      req.params.userId, 
      { 
        $push: { friends: req.body.friendId },
        $pull: { friend_requests_received: req.body.friendId }
      }
    ).exec(),
    User.findByIdAndUpdate(
      req.body.friendId, 
      { 
        $push: { friends: req.params.userId },
        $pull: { friend_requests_sent: req.params.userId }
      }
    ).exec()
  ]).then((docs) => {
    res.sendStatus(201);
  }).catch((err) => next(err));
};

// DELETE delete a friend
exports.friends_delete = (req, res, next) => {
  Promise.all([
    User.findByIdAndUpdate(
      req.params.userId, 
      { $pull: { friends: req.params.friendId }}
    ).exec(),
    User.findByIdAndUpdate(
      req.params.friendId, 
      { $pull: { friends: req.params.userId }}
    ).exec()
  ]).then((docs) => {
    res.sendStatus(200);
  }).catch((err) => next(err));
};

// GET list of incoming or outgoing friend requests for a given user
exports.friend_requests_get = (req, res, next) => {
  if (req.query.received === 'true') {
    return User.findById(req.params.userId, 'last_name first_name friend_requests_received')
        .populate('friend_requests_received', 'last_name first_name name')
        .exec((err, requests) => {
          if (err) return next(err);
          res.json(requests);
        });
  }
  if (req.query.sent === 'true') {
    return User.findById(req.params.userId, 'last_name first_name friend_requests_sent')
        .populate('friend_requests_sent', 'last_name first_name name')
        .exec((err, requests) => {
          if (err) return next(err);
          res.json(requests);
        });
  }
  // if query doesn't include info about type of friend requests, send page
  // not found code
  res.sendStatus(404);
};

// POST send a friend request
exports.friend_request_create = (req, res, next) => {
  Promise.all([
    User.findByIdAndUpdate(
      req.params.userId, 
      { $push: { friend_requests_sent: req.body.friendId }}
    ).exec(),
    User.findByIdAndUpdate(
      req.body.friendId, 
      { $push: { friend_requests_received: req.params.userId }}
    ).exec()
  ]).then((docs) => {
    res.sendStatus(201);
  }).catch((err) => next(err));
};

// DELETE either decline an incoming friend request or unsend a request
// previously sent
exports.friend_request_delete = (req, res, next) => {
  if (req.query.decline === 'true') {
    return Promise.all([
      User.findByIdAndUpdate(
        req.params.userId, 
        { $pull: { friend_requests_received: req.params.friendId }}
      ).exec(),
      User.findByIdAndUpdate(
        req.params.friendId, 
        { $pull: { friend_requests_sent: req.params.userId }}
      ).exec()
    ]).then((docs) => {
      res.sendStatus(200);
    }).catch((err) => next(err));
  }
  if (req.query.unsend === 'true') {
    return Promise.all([
      User.findByIdAndUpdate(
        req.params.userId, 
        { $pull: { friend_requests_sent: req.params.friendId }}
      ).exec(),
      User.findByIdAndUpdate(
        req.params.friendId, 
        { $pull: { friend_requests_received: req.params.userId }}
      ).exec()
    ]).then((docs) => {
      res.sendStatus(200);
    }).catch((err) => next(err));
  }
  // if query doesn't include info about type of friend requests, send page
  // not found code
  res.sendStatus(404);
};
