const Reaction = require('../models/reaction');

// POST add a reaction to a given post
exports.reactions_add = (req, res, next) => {
  new Reaction({
    author: req.user.id,
    parent_id: req.query.parentId,
    value: req.body.value
  }).save((err) => {
    if (err) return next(err);
    // indicates new post was successfully created
    res.sendStatus(201);
  });
};

// PUT update reaction to a given post
exports.reactions_update = (req, res, next) => {
  Reaction.findByIdAndUpdate(
    req.params.reactionId, 
    { value: req.body.value },
    (err, reaction) => {
      if (err) return next(err);
      // indicates update was successful
      res.sendStatus(200);
    }
  );
};

// DELETE delete reaction to a given post
exports.reactions_delete = (req, res, next) => {
  Reaction.findByIdAndDelete(req.params.reactionId, (err) => {
    if (err) return next(err);
    // indicates deletion was successful
    res.sendStatus(200);
  });
};