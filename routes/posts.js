const express = require('express');
const router = express.Router();

// import controllers
const postController = require('../controllers/postController');

// import authentication middleware that prevents a user from accessing other
// user's data
const isUser = require('../auth/authMiddleware').isUser;

// GET list of all posts for a given user
router.get('/', postController.posts_list);

// POST add a new post
router.post('/', postController.posts_add);

// PUT update a post
router.put('/:postId', isUser, postController.posts_update);

// DELETE delete a post
router.delete('/:postId', isUser, postController.posts_delete);

module.exports = router;