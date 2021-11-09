// import models
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');

exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(403);
  }
};

// ensure a user can only access routes pertaining to their own data
exports.isUser = (req, res, next) => {
  if (req.params.username && req.params.username !== req.user.username) {
    // for routes where userId is used as a parameter to access or edit DB
    res.sendStatus(403);
  } else if (req.params.postId) { // covers routes where postId is used to access DB
    // for routes where postId is used as a parameter to access or edit DB
    Post.findById(req.params.postId, (err, post) => {
      if (err) return next(err);
      if (
           post
        && post.destination_profile != req.user.id 
        && post.author != req.user.id
      ) {
        // access is not allowed if the user is neither the author of the post
        // nor the owner of the profile where the post appears 
        return res.sendStatus(403);
      }
      next();
    });
  } else if (req.params.commentId) {
    // for routes where commentId is used as a parameter to access or edit DB
    Comment.findById(req.params.commentId, (err, comment) => {
      if (err) return next(err);
      if (
           comment
        && comment.destination_profile != req.user.id 
        && comment.author != req.user.id
      ) {
        // access is not allowed if the user is neither the author of the comment
        // nor the owner of the profile where the comment appears 
        return res.sendStatus(403);
      }
      next();
    });
  } else if (req.params.reactionId) {
    // for routes where reactionId is used as a parameter to access or edit DB
    Reaction.findById(req.params.reactionId, (err, reaction) => {
      if (err) return next(err);
      if (reaction && reaction.author != req.user.id) {
        // access is not allowed if the user is not the author of the reaction 
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    next();
  }
};
