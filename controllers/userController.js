const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// GET user's homepage with profile info, posts, and their respective comments
exports.index = async (req, res, next) => {
  // query DB for user info
  User.findOne({ username: req.params.username })
      .populate('friends', 'last_name first_name name username')
      .exec((err, user) => {
        if (err) return next(err);

        // if only user's account information is requested
        if (req.query.accountInfo === 'true') {
          // remove sensitive info from user object before sending it to client
          const {
            _id,
            password,
            ...sanitizedUser
          } = user.toObject();

          return res.json({ user: sanitizedUser });
        }
        
        // use user ID to retrieve all posts on given user's profile
        Post.find({ destination_profile: user._id })
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
            .exec((err, posts) => {
              if (err) return next(err);

              // remove sensitive info from user object before sending it to
              // client
              const {
                _id,
                password,
                ...sanitizedUser
              } = user.toObject();

              res.json({ user: sanitizedUser, posts });
            });
      });
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
      req.user.id, 
      updateObj,
      { new: true },
      (err, updatedUser) => {
        if (err) return next(err);

        // remove sensitive info from user object before sending it to client
        const { 
          _id,
          password,
          ...sanitizedUser
        } = updatedUser.toObject();

        res.status(200).json({ user: sanitizedUser });
      }
    );
  }
];

// DELETE delete user's account, posts, comments, and reactions
exports.delete_account = (req, res, next) => {
  Promise.all([
    User.findByIdAndDelete(req.user.id).exec(),
    Post.deleteMany({ $or: [
      { author: req.user.id },
      { destination_profile: req.user.id }
    ] }).exec(),
    Comment.deleteMany({ $or: [
      { author: req.user.id },
      { destination_profile: req.user.id }
    ] }).exec(),
    Reaction.deleteMany({ $or: [
      { author: req.user.id },
      { destination_profile: req.user.id }
    ] }).exec()
  ]).then(() => {
    // indicates deletion was successful
    res.sendStatus(200);
  }).catch((err) => next(err));
};

// GET list of user's friends
exports.friends_list = (req, res, next) => {
  User.findOne(
        { username: req.params.username }, 
        'friends'
      )
      .populate('friends', 'last_name first_name name username')
      .exec((err, user) => {
        if (err) return next(err);
        
        res.json({ friends: user.friends });
      });
};

// POST add new friend (i.e., accept friend request)
exports.friends_add = (req, res, next) => {
  Promise.all([
    User.findByIdAndUpdate(
      req.user.id, 
      { 
        $push: { friends: req.body.friendId },
        $pull: { friend_requests_received: req.body.friendId }
      }
    ).exec(),
    User.findByIdAndUpdate(
      req.body.friendId, 
      { 
        $push: { friends: req.user.id },
        $pull: { friend_requests_sent: req.user.id }
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
      req.user.id, 
      { $pull: { friends: req.params.friendId }}
    ).exec(),
    User.findByIdAndUpdate(
      req.params.friendId, 
      { $pull: { friends: req.user.id }}
    ).exec()
  ]).then((docs) => {
    res.sendStatus(200);
  }).catch((err) => next(err));
};

// GET list of incoming or outgoing friend requests for a given user
exports.friend_requests_get = (req, res, next) => {
  if (req.query.received === 'true') {
    return User.findById(req.user.id, 'friend_requests_received')
                .populate(
                  'friend_requests_received', 
                  'last_name first_name name'
                )
                .exec((err, user) => {
                  if (err) return next(err);
                  res.json({ 
                    requests_received: user.friend_requests_received
                  });
                });
  }
  if (req.query.sent === 'true') {
    return User.findById(req.user.id, 'friend_requests_sent')
                .populate(
                  'friend_requests_sent', 
                  'last_name first_name name'
                )
                .exec((err, user) => {
                  if (err) return next(err);
                  res.json({ requests_sent: user.friend_requests_sent });
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
      req.user.id, 
      { $push: { friend_requests_sent: req.body.friendId }}
    ).exec(),
    User.findByIdAndUpdate(
      req.body.friendId, 
      { $push: { friend_requests_received: req.user.id }}
    ).exec()
  ]).then((docs) => {
    res.sendStatus(201);
  }).catch((err) => next(err));
};

// DELETE either decline an incoming friend request or unsend a request
// previously sent
exports.friend_request_delete = (req, res, next) => {
  // decline an incoming friend request
  if (req.query.decline === 'true') {
    return Promise.all([
      User.findByIdUpdate(
        req.user.id, 
        { $pull: { friend_requests_received: req.params.friendId }}
      ).exec(),
      User.findByIdAndUpdate(
        req.params.friendId, 
        { $pull: { friend_requests_sent: req.user.id }}
      ).exec()
    ]).then((docs) => {
      res.sendStatus(200);
    }).catch((err) => next(err));
  }

  // cancel a friend request previously sent
  if (req.query.unsend === 'true') {
    return Promise.all([
      User.findByIdAndUpdate(
        req.user.id, 
        { $pull: { friend_requests_sent: req.params.friendId }}
      ).exec(),
      User.findByIdAndUpdate(
        req.params.friendId, 
        { $pull: { friend_requests_received: req.user.id }}
      ).exec()
    ]).then((docs) => {
      res.sendStatus(200);
    }).catch((err) => next(err));
  }
  // if query doesn't include info about type of friend requests, send page
  // not found code
  res.sendStatus(404);
};
