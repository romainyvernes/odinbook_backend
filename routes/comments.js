const express = require('express');
const router = express.Router();

// import comment controller
const commentController = require('../controllers/commentController');

// POST add a new comment for a given post
router.post('/', commentController.comments_add);

// PUT update a comment
router.put('/:commentId', commentController.comments_update);

// DELETE delete a comment
router.delete('/:commentId', commentController.comments_delete);

module.exports = router;