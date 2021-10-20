const express = require('express');
const router = express.Router();

// import comment controller
const commentController = require('../controllers/commentController');

// import authentication middleware that prevents a user from accessing other
// user's data
const isUser = require('../auth/authMiddleware').isUser;

// POST add a new comment for a given post
router.post('/', commentController.comments_add);

// PUT update a comment
router.put('/:commentId', isUser, commentController.comments_update);

// DELETE delete a comment
router.delete('/:commentId', isUser, commentController.comments_delete);

module.exports = router;