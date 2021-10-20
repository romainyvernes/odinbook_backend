const Post = require('../models/post');
const User = require('../models/user');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// GET list of all posts on a user's profile
exports.posts_list = (req, res, next) => {
  Post.find({ destination_profile: req.query.profileId })
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
        res.json(posts);
      });
};

// POST add a new post
exports.posts_add = [
  body('profileId').trim()
                   .notEmpty()
                   .escape()
                   .withMessage('Profile ID must be provided.'),
  body('content').trim()
                 .notEmpty()
                 .escape()
                 .withMessage('Post must not be empty.'),

  handleValidationErrors,

  (req, res, next) => {
    // check if profileId provided matches a user in DB
    User.findById(req.body.profileId, (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.json({ message: 'Profile ID does not match a user.' });
      }

      // create a new post and save it to DB
      new Post({
        author: req.user.id,
        destination_profile: req.body.profileId,
        content: req.body.content
      }).save((err) => {
        if (err) return next(err);
        // indicates new post was successfully created
        res.sendStatus(201);
      });
    });
  }
];

// PUT update a post
exports.posts_update = [
  body('content').trim()
                 .notEmpty()
                 .escape()
                 .withMessage('Post must not be empty.'),

  handleValidationErrors,

  (req, res, next) => {
    Post.findByIdAndUpdate(
      req.params.postId, 
      { content: req.body.content },
      (err, post) => {
        if (err) return next(err);
        // indicates update was successful
        res.sendStatus(200);
      }
    );
  }
];

// DELETE delete a post
exports.posts_delete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.postId, (err) => {
    if (err) return next(err);
    // indicates deletion was successful
    res.sendStatus(200);
  });
};
