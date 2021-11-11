const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const Reaction = require('../models/reaction');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// GET retrieve comments matching a certain parent comment
exports.comments_get = (req, res, next) => {
  if (req.query.parentId) {
    return Comment.find({ parent_id: req.query.parentId })
                  .populate('author', 'last_name first_name name username')
                  .populate('replies')
                  .populate({ 
                    path: 'reactions',
                    populate: {
                      path: 'author',
                      select: 'last_name first_name name username'
                    }
                  })
                  .exec((err, comments) => {
                    if (err) return next(err);

                    res.json(comments);
                  });
  }

  res.sendStatus(404);
};

// POST add a new comment for a given post
exports.comments_add = [
  body('parentId').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Parent ID must be provided.'),
  body('postId').trim()
                .notEmpty()
                .escape()
                .withMessage('Post ID must be provided.'),
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

        const newComment = new Comment({
          author: req.user.id,
          parent_id: req.body.parentId,
          post_id: req.body.postId,
          content: req.body.content,
          destination_profile: req.body.profileId
        })
        
        newComment.save((err) => {
          if (err) return next(err);

          newComment.populate([
            { path: 'author', select: 'last_name first_name name username' },
            { 
              path: 'reactions',
              populate: {
                path: 'author',
                select: 'last_name first_name name username'
              }
            },
            { path: 'replies' }
          ]).then((populatedComment) => {
            // indicates new post was successfully created
            res.status(201).json(populatedComment);
          });
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
      { new: true },
      (err, updatedComment) => {
        if (err) return next(err);
        // indicates update was successful
        res.json(updatedComment);
      }
    );
  }
];

// DELETE delete a comment
exports.comments_delete = (req, res, next) => {
  Promise.all([
    Comment.findByIdAndDelete(req.params.commentId).exec(),
    Comment.deleteMany({ parent_id: req.params.commentId }).exec(),
    Reaction.deleteMany({ parent_id: req.params.commentId }).exec()
  ]).then(() => {
    // indicates deletion was successful
    res.sendStatus(200);
  }).catch((err) => next(err));
};
