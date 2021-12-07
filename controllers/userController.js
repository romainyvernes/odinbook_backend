const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// GET user's homepage with profile info, posts, and their respective comments
exports.index = async (req, res, next) => {
  // query DB for user info
  User.findOne({ username: req.params.username })
      .populate('friends', 'last_name first_name name username picture')
      .exec((err, user) => {
        if (err) return next(err);

        // if only user's account information is requested
        if (req.query.accountInfo === 'true') {
          // remove sensitive info from user object before sending it to client
          const {
            password,
            ...sanitizedUser
          } = user.toObject();

          return res.json(sanitizedUser);
        }
        
        // use user ID to retrieve all posts on given user's profile
        Post.find({ destination_profile: user._id })
            .sort('-date')
            .populate('author', 'last_name first_name name username picture')
            .populate({ 
              path: 'comments', 
              populate: [
                { 
                  path: 'author', 
                  select: 'last_name first_name name username picture' 
                },
                { 
                  path: 'reactions',
                  populate: {
                    path: 'author',
                    select: 'last_name first_name name username picture'
                  }
                },
                {
                  path: 'replies'
                }
              ]
            })
            .populate({ 
              path: 'reactions', 
              populate: { path: 'author', select: 'last_name first_name name username picture' }
            })
            .populate('destination_profile', 'last_name first_name name username picture')
            .exec((err, posts) => {
              if (err) return next(err);

              // remove sensitive info from user object before sending it to
              // client
              const {
                password,
                ...sanitizedUser
              } = user.toObject();

              res.json({ user: sanitizedUser, posts });
            });
      });
};

// PUT update user's account details
exports.update_account = [
  body('password').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Password must be at least 1 character long.')
                  .optional(),
  body('email').trim()
               .isLength({ min: 3 })
               .escape()
               .isEmail()
               .withMessage('Email address is invalid.')
               .optional(),
  body('firstName').trim()
                   .notEmpty()
                   .escape()
                   .withMessage('First name must be at least 1 character long.')
                   .optional(),
  body('lastName').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Last name must be at least 1 character long.')
                  .optional(),

  handleValidationErrors,

  async (req, res, next) => {
    if (req.params.username === 'guestuser') {
      return res.status(403).json('Guest user account cannot be updated.');
    }

    const updateObj = {
      password: req.body.password,
      email: req.body.email,
      first_name: req.body.firstName,
      last_name: req.body.lastName
    };

    // if a password change is submitted, encode it first
    if (updateObj.password) {
      try {
        updateObj.password = await bcrypt.hash(updateObj.password, 10);
      } catch (err) {
        next(err);
      }
    }

    // if an email address change is submitted, ensure it doesn't already exist
    if (updateObj.email) {
      try {
        const userFound = await User.findOne({ email: updateObj.email })
                                    .exec();

        // check if a user is found and whether that user is different from the
        // authenticated user
        if (userFound && userFound.username !== req.params.username) {
          return res.status(409).json("Email address already exists.");
        }
      } catch (err) {
        next(err);
      }
    }

    User.findOneAndUpdate(
      { username: req.params.username }, 
      updateObj,
      { new: true },
      (err, updatedUser) => {
        if (err) return next(err);

        // remove sensitive info from user object before sending it to client
        const { 
          password,
          ...sanitizedUser
        } = updatedUser.toObject();

        res.status(200).json(sanitizedUser);
      }
    );
  }
];

// DELETE delete user's account, posts, comments, and reactions
exports.delete_account = (req, res, next) => {
  if (req.params.username === 'guestuser') {
    return res.status(403).json('Guest user account cannot be updated.');
  }

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

// PUT update user's profile picture
exports.upload_picture = (req, res, next) => {
  if (req.file) {
    User.findOneAndUpdate(
      { username: req.params.username },
      { picture: {
          url: req.file.location
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) return next(err);

        // remove sensitive info from user object before sending it to client
        const { 
          password,
          ...sanitizedUser
        } = updatedUser.toObject();

        res.status(200).json(sanitizedUser);
      }
    );
  } else {
    res.sendStatus(400);
  }
};

// GET list of user's friends
exports.friends_list = (req, res, next) => {
  User.findOne(
        { username: req.params.username }, 
        'friends'
      )
      .populate('friends', 'last_name first_name name username picture')
      .exec((err, user) => {
        if (err) return next(err);
        res.json(user.friends);
      });
};

exports.search = (req, res, next) => {
  const queryArr = req.query.name.split(' ');
  
  User.find({ $or: [
    { first_name: { 
      $regex: new RegExp(`^${queryArr[0]}`, 'i') 
    }},
    { last_name: { 
      $regex: new RegExp(`^${queryArr[queryArr.length - 1]}`, 'i') 
    }}
  ]}).exec((err, users) => {
    if (err) return next(err);
    res.json(users);
  });
};

// POST add new friend (i.e., accept friend request)
exports.friends_add = (req, res, next) => {
  // check first if the friend being added is not already a friend
  User.findOne({ id_: req.user.id, friends: req.body.friendId })
      .exec((err, user) => {
        if (err) return next(err);
        if (user) return res.status(409).json("Users are already friends.");

        // proceed to update both authenticated user and friend
        Promise.all([
          User.findByIdAndUpdate(
            req.user.id, 
            { 
              $push: { friends: req.body.friendId },
              $pull: { friend_requests_received: req.body.friendId }
            },
            { new: true }
          ).exec(),
          User.findByIdAndUpdate(
            req.body.friendId, 
            { 
              $push: { friends: req.user.id },
              $pull: { friend_requests_sent: req.user.id }
            },
            { new: true }
          ).exec()
        ]).then(([updatedAuthenticatedUser, updatedFriend]) => {
          updatedAuthenticatedUser = updatedAuthenticatedUser.toObject();
          delete updatedAuthenticatedUser.password;

          updatedFriend = updatedFriend.toObject();
          delete updatedFriend.password;

          res.status(201).json({
            user: updatedAuthenticatedUser,
            friend: updatedFriend
          });
        }).catch((err) => next(err));
      });
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
  // if no query info was provided in route, return "not found" response
  if (req.query.received !== 'true' && req.query.sent !== 'true') {
    return res.sendStatus(404);
  }
  
  User.findById(req.user.id, 'friend_requests_received friend_requests_sent')
      .populate(
        'friend_requests_received', 
        'last_name first_name name username picture'
      )
      .populate(
        'friend_requests_sent', 
        'last_name first_name name username picture'
      )
      .exec((err, user) => {
        if (err) return next(err);

        const returnObj = {};

        if (req.query.received === 'true') {
          returnObj.friendRequestsReceived = user.friend_requests_received;
        }

        if (req.query.sent === 'true') {
          returnObj.friendRequestsSent = user.friend_requests_sent;
        }

        res.json(returnObj);
      });
};

// POST send a friend request
exports.friend_request_create = (req, res, next) => {
  // check first if the friend being added is not already a friend
  User.findOne({ id_: req.user.id, friend_requests_sent: req.body.friendId })
      .exec((err, user) => {
        if (err) return next(err);
        if (user) return res.status(409).json("Friend request already sent.");

        Promise.all([
          User.findByIdAndUpdate(
            req.user.id, 
            { $push: { friend_requests_sent: req.body.friendId }},
            { new: true }
          ).exec(),
          User.findByIdAndUpdate(
            req.body.friendId, 
            { $push: { friend_requests_received: req.user.id }},
            { new: true }
          ).exec()
        ]).then(([updatedAuthenticatedUser, updatedFriend]) => {
          const { 
            password,
            ...sanitizedUser
          } = updatedFriend.toObject();
      
          res.status(201).json(sanitizedUser);
        }).catch((err) => next(err));
      });
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
