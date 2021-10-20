const express = require('express');
const router = express.Router();

// import controllers
const reactionController = require('../controllers/reactionController');

// import authentication middleware that prevents a user from accessing other
// user's data
const isUser = require('../auth/authMiddleware').isUser;

// POST add a reaction to a given post
router.post('/', reactionController.reactions_add);

// PUT update reaction to a given post
router.put('/:reactionId', isUser, reactionController.reactions_update);

// DELETE delete reaction to a given post
router.delete('/:reactionId', isUser, reactionController.reactions_delete);

module.exports = router;