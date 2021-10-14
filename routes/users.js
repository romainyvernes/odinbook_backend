const express = require('express');
const router = express.Router();

// import controllers
const userController = require('../controllers/userController');

// GET user's homepage with profile info, posts, and their respective comments
router.get('/:userId', userController.index);

// POST send a friend request
router.post('/:userId/requests', userController.friend_request_create);

// GET list of incoming friend requests for a given user
router.get('/:userId/requests/inbound', userController.friend_requests_received);

// GET list of outgoing friend requests for a given user
router.get('/:userId/requests/outbound', userController.friend_requests_sent);

// GET list of user's friends
router.get('/:userId/friends', userController.friends_list);

// POST add new friend (i.e., accept friend request)
router.post('/:userId/friends', userController.friends_add);

// DELETE delete a friend
router.delete('/:userId/friends/:friendId', userController.friends_delete);

module.exports = router;