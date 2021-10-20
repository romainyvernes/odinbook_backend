const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// POST add a new comment for a given post
exports.comments_add = [
  body('parentId').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Parent ID must be provided.'),
  body('profileId').trim()
                   .notEmpty()
                   .escape()
                   .withMessage('Profile ID must be provided.'),
  body('content').trim()
                 .notEmpty()
                 .escape()
                 .withMessage('Comment must not be empty.'),

  handleValidationErrors,

  (req, res, next) => {
    // check if profileId provided matches a user in DB
    User.findById(req.body.profileId, (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.json({ message: 'Profile ID does not match a user.' });
      }
      
      // since parentId could match a comment or a post, query both collections
      // and check if a result comes up in either one
      Promise.all([
        Post.findById(req.body.parentId).exec(),
        Comment.findById(req.body.parentId).exec()
      ]).then(([post, comment]) => {
        if (!post && !comment) {
          return res.json({ 
            message: 'Parent ID does not match a post or a comment.' 
          });
        }

        // create new comment
        new Comment({
          author: req.user.id,
          parent_id: req.body.parentId,
          content: req.body.content,
          destination_profile: req.body.profileId
        }).save((err) => {
          if (err) return next(err);
          // indicates new post was successfully created
          res.sendStatus(201);
        });
      }).catch((err) => next(err));
    });
  }
];

// PUT update a comment
exports.comments_update = [
  body('content').trim()
                 .notEmpty()
                 .escape()
                 .withMessage('Comment must not be empty.'),

  handleValidationErrors,

  (req, res, next) => {
    Comment.findByIdAndUpdate(
      req.params.commentId, 
      { content: req.body.content },
      (err, comment) => {
        if (err) return next(err);
        // indicates update was successful
        res.sendStatus(200);
      }
    );
  }
];

// DELETE delete a comment
exports.comments_delete = (req, res, next) => {
  Comment.findByIdAndDelete(req.params.commentId, (err) => {
    if (err) return next(err);
    // indicates deletion was successful
    res.sendStatus(200);
  });
};
