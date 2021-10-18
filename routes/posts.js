const express = require('express');
const router = express.Router();

// import controllers
const postController = require('../controllers/postController');

// GET list of all posts for a given user
router.get('/:authorId', postController.posts_list);

// POST add a new post
router.post('/:authorId', postController.posts_add);

// PUT update a post
router.put('/:postId', postController.posts_update);

// DELETE delete a post
router.delete('/:postId', postController.posts_delete);

module.exports = router;