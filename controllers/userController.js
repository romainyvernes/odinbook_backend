const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');

// GET list of incoming friend requests for a given user
exports.friend_requests_received = (req, res, next) => {
  User.findById(req.user.id, 'friend_requests_received')
      .populate('friend_requests_received', 'first_name last_name')
      .exec((err, requests) => {
        if (err) return next(err);
        res.json(requests);
      });
};

// GET list of outgoing friend requests for a given user
exports.friend_requests_sent = (req, res, next) => {
  User.findById(req.user.id, 'friend_requests_sent')
      .populate('friend_requests_sent', 'first_name last_name')
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
  Promise.all([
    User.findById(req.user.id, 'first_name last_name friends')
        .populate('friends', 'first_name last_name')
        .exec(),
    Post.find({ destination_profile: req.user.id })
        .sort('-date')
        .populate('author', 'first_name last_name')
        .exec(),
    Comment.find({ })
  ]);
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
