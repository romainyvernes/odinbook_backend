const Reaction = require('../models/reaction');
const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const { body } = require('express-validator');
const handleValidationErrors = require('../errors/errorMiddleware')
                                  .handleValidationErrors;

// POST add a reaction to a given post
exports.reactions_add = [
  body('parentId').trim()
                  .notEmpty()
                  .escape()
                  .withMessage('Parent ID must be provided.'),
  body('profileId').trim()
                   .notEmpty()
                   .escape()
                   .withMessage('Profile ID must be provided.'),
  body('value').trim()
               .escape(),

  // value doesn't need validation because it was already built into Reaction 
  // model

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

        const newReaction = new Reaction({
          author: req.user.id,
          parent_id: req.body.parentId,
          value: req.body.value,
          destination_profile: req.body.profileId
        });
        
        newReaction.save((err) => {
          if (err) return next(err);

          newReaction.populate('author', 'last_name first_name name username')
                      .then((populatedReaction) => {
                        // indicates new reaction was successfully created
                        res.status(201).json(populatedReaction);
                      });
        });
      }).catch((err) => next(err));
    });
  }
];

// PUT update reaction to a given post
exports.reactions_update = [
  body('value').trim()
               .escape(),

  handleValidationErrors,
  
  (req, res, next) => {
    Reaction.findByIdAndUpdate(
      req.params.reactionId, 
      { value: req.body.value },
      { new: true },
      (err, updatedReaction) => {
        if (err) return next(err);
        // indicates update was successful
        res.json(updatedReaction);
      }
    );
  }
];

// DELETE delete reaction to a given post
exports.reactions_delete = (req, res, next) => {
  Reaction.findByIdAndDelete(req.params.reactionId, (err) => {
    if (err) return next(err);
    // indicates deletion was successful
    res.sendStatus(200);
  });
};