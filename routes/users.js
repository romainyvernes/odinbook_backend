const express = require('express');
const router = express.Router();

// import controllers
const userController = require('../controllers/userController');

// GET user's homepage with profile info, posts, and their respective comments
router.get('/:userId', userController.index);

// PUT update user's account details
router.put('/:userId', userController.update_account);

// DELETE delete user's account
router.delete('/:userId', userController.delete_account);

// GET list of incoming friend requests for a given user
router.get('/:userId/requests/inbound', userController.friend_requests_received);

// DELETE decline a specific friend request
router.delete('/:userId/requests/inbound/:friendId', userController.decline_friend_request);

// GET list of outgoing friend requests for a given user
router.get('/:userId/requests/outbound', userController.friend_requests_sent);

// POST send a friend request
router.post('/:userId/requests/outbound', userController.friend_request_create);

// DELETE cancel a specific friend request
router.delete('/:userId/requests/outbound/:friendId', userController.cancel_friend_request);

// GET list of user's friends
router.get('/:userId/friends', userController.friends_list);

// POST add new friend (i.e., accept friend request)
router.post('/:userId/friends', userController.friends_add);

// DELETE delete a friend
router.delete('/:userId/friends/:friendId', userController.friends_delete);

module.exports = router;