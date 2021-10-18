const Comment = require('../models/comment');

// POST add a new comment for a given post
exports.comments_add = (req, res, next) => {
  new Comment({
    author: req.user.id,
    parent_id: req.body.parentId,
    content: req.body.text
  }).save((err) => {
    if (err) return next(err);
    // indicates new post was successfully created
    res.status(201);
  });
};

// PUT update a comment
exports.comments_update = (req, res, next) => {
  Comment.findByIdAndUpdate(
    req.params.commentId, 
    { content: req.body.text },
    (err, comment) => {
      if (err) return next(err);
      // indicates update was successful
      res.status(200);
    }
  );
};

// DELETE delete a comment
exports.comments_delete = (req, res, next) => {
  Comment.findByIdAndDelete(req.params.commentId, (err) => {
    if (err) return next(err);
    // indicates deletion was successful
    res.status(200);
  });
};
