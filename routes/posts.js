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

// GET list of all reactions to a given post
router.get('/:postId/reactions', postController.post_reactions_list);

// POST add a reaction to a given post
router.post('/:postId/reactions', postController.post_reactions_add);

// PUT update reaction to a given post
router.put('/:postId/reactions/:authorId', postController.post_reactions_update);

// DELETE delete reaction to a given post
router.delete('/:postId/reactions/:authorId', postController.post_reactions_delete);

module.exports = router;