const express = require('express');
const router = express.Router();

// import comment controller
const commentController = require('../controllers/commentController');

// GET list of all comments for a given post
router.get('/:parentPostId', commentController.comments_list);

// POST add a new comment for a given post
router.post('/:parentPostId', commentController.comments_add);

// PUT update a comment
router.put('/:commentId', commentController.comments_update);

// DELETE delete a comment
router.delete('/:commentId', commentController.comments_delete);

// GET list of all reactions to a given comment
router.get('/:commentId/reactions', commentController.comment_reactions_list);

// POST add a reaction to a given comment
router.post('/:commentId/reactions', commentController.comment_reactions_add);

// PUT update reaction to a given comment
router.put('/:commentId/reactions/:authorId', commentController.comment_reactions_update);

// DELETE delete reaction to a given comment
router.delete('/:commentId/reactions/:authorId', commentController.comment_reactions_delete);

module.exports = router;