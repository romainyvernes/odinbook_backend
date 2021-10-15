const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');

// GET list of incoming friend requests for a given user
exports.friend_requests_received = (req, res, next) => {
  User.findById(req.user.id, 'friend_requests_received')
      .populate('friend_requests_received', 'name')
      .exec((err, requests) => {
        if (err) return next(err);
        res.json(requests);
      });
};

// GET list of outgoing friend requests for a given user
exports.friend_requests_sent = (req, res, next) => {
  User.findById(req.user.id, 'friend_requests_sent')
      .populate('friend_requests_sent', 'name')
      .exec((err, requests) => {
        if (err) return next(err);
        res.json(requests);
      });
};

// POST send a friend request
exports.friend_request_create = (req, res, next) => {

};

// GET user's homepage with profile info, posts, and their respective comments
exports.index = (req, res, next) => {
  // query DB for both user and posts at the same time
  Promise.all([
    User.findById(req.user.id, 'name friends')
        .populate('friends', 'name')
        .exec(),
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
        .exec()
  ]).then(([userDoc, postDocs]) => {
    res.json({ profile_data: userDoc, posts: postDocs });
  }).catch((err) => next(err));
};

// GET list of user's friends
exports.friends_list = (req, res, next) => {

};

// POST add new friend (i.e., accept friend request)
exports.friends_add = (req, res, next) => {

};

// DELETE delete a friend
exports.friends_delete = (req, res, next) => {

};
