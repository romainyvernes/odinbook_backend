const Post = require('../models/post');
const User = require('../models/user');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// GET list of all posts on a user's profile or all recent posts
exports.posts_list = (req, res, next) => {
  let postQuery = null;

  // posts on the user's profile whose profileId is provided
  if (req.query.profileId === 'true') {
    postQuery = Post.find({ destination_profile: req.query.profileId })
                    .sort('-date');
      
  }

  // latest 100 posts added to DB.
  // NOTE: if postQuery is not null, it implies a value was assigned to it in
  // the above query which gives the profileId query precedence
  if (!postQuery && req.query.recent === 'true') {
    postQuery = Post.find({})
                    .sort('-date')
                    .limit(50);
  }

  // if postQuery is still null at this time, no query was provided in route
  if (!postQuery) {
    return res.sendStatus(404);
  }

  postQuery.populate('author', 'last_name first_name name username')
            .populate({ 
              path: 'comments', 
              populate: [
                { 
                  path: 'author', 
                  select: 'last_name first_name name username' 
                },
                { 
                  path: 'reactions',
                  populate: {
                    path: 'author',
                    select: 'last_name first_name name username'
                  }
                },
                {
                  path: 'replies'
                }
              ]
            })
            .populate({ 
              path: 'reactions', 
              populate: { path: 'author', select: 'last_name first_name name username' }
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

      const newPost = new Post({
        author: req.user.id,
        destination_profile: req.body.profileId,
        content: req.body.content
      })
      
      newPost.save((err) => {
        if (err) return next(err);
        // indicates new post was successfully created
        res.status(201).json(newPost);
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
      { new: true },
      (err, updatedPost) => {
        if (err) return next(err);
        // indicates update was successful
        res.json(updatedPost);
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
