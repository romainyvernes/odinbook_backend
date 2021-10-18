const Post = require('../models/post');

// GET list of all posts on a user's profile
exports.posts_list = (req, res, next) => {
  Post.find({ destination_profile: req.user.id })
      .sort('-date')
      .populate('author', 'name')
      .populate({ 
        path: 'comments', 
        populate: [
          { 
            path: 'author', 
            select: 'name' 
          },
          { 
            path: 'reactions',
            populate: {
              path: 'author',
              select: 'name'
            }
          }
        ]
      })
      .populate({ 
        path: 'reactions', 
        populate: { path: 'author', select: 'name' }
      })
      .exec((err, posts) => {
        if (err) return next(err);
        res.json(posts);
      });
};

// POST add a new post
exports.posts_add = (req, res, next) => {
  new Post({
    author: req.user.id,
    destination_profile: req.body.profile_id,
    content: req.body.text
  }).save((err) => {
    if (err) return next(err);
    // indicates new post was successfully created
    res.status(201);
  });
};

// PUT update a post
exports.posts_update = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.postId, 
    { content: req.body.text },
    (err, post) => {
      if (err) return next(err);
      // indicates update was successful
      res.status(200);
    }
  );
};

// DELETE delete a post
exports.posts_delete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.postId, (err) => {
    if (err) return next(err);
    // indicates deletion was successful
    res.status(200);
  });
};
