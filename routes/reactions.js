const express = require('express');
const router = express.Router();

// import controllers
const reactionController = require('../controllers/reactionController');

// POST add a reaction to a given post
router.post('/', reactionController.reactions_add);

// PUT update reaction to a given post
router.put('/:reactionId', reactionController.reactions_update);

// DELETE delete reaction to a given post
router.delete('/:reactionId', reactionController.reactions_delete);

module.exports = router;